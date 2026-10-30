import assert from "node:assert/strict";
import { afterEach, test } from "node:test";
import { cleanAttribution, sendToTyloHQ, tylohqPayload } from "../lib/tylohq.ts";

afterEach(() => {
  delete process.env.TYLOHQ_LEADS_URL;
});

test("attribution: only known keys, short, printable; page must be a path", () => {
  const a = cleanAttribution({
    page: "/software/app-bauplan",
    referrer: "www.google.com",
    utm_source: "facebook",
    utm_campaign: "Herbst\n2026",
    gclid: "x".repeat(900),
    evil: "<script>",
    __proto__: { polluted: true },
  });
  assert.equal(a.page, "/software/app-bauplan");
  assert.equal(a.referrer, "www.google.com");
  assert.equal(a.utm_campaign, "Herbst 2026");
  assert.equal(a.gclid.length, 300);
  assert.equal("evil" in a, false);
  assert.equal(({} as Record<string, unknown>).polluted, undefined);
  assert.equal(cleanAttribution({ page: "https://evil.example/x" }).page, "");
  assert.equal(cleanAttribution({ referrer: "javascript:alert(1)" }).referrer, "");
  assert.equal(cleanAttribution("nope").page, "");
  assert.equal(cleanAttribution(null).utm_source, "");
});

test("payload: answers first, empty ones left out, attribution as fields, campaign and source on top", () => {
  const body = tylohqPayload(
    "Kontaktformular",
    [
      { label: "Name", value: "Erika Muster" },
      { label: "Firma", value: "" },
      { label: "E-Mail", value: "erika@example.de" },
    ],
    cleanAttribution({ page: "/kontakt", utm_source: "google", utm_campaign: "Brand", gclid: "Cj0" }),
    "id-1",
    new Date("2026-10-30T12:00:00Z"),
  );
  assert.deepEqual(body, {
    form_name: "Kontaktformular",
    submission_id: "id-1",
    submitted_at: "2026-10-30T12:00:00.000Z",
    utm_campaign: "Brand",
    utm_source: "google",
    fields: [
      { label: "Name", value: "Erika Muster" },
      { label: "E-Mail", value: "erika@example.de" },
      { label: "Seite", value: "/kontakt" },
      { label: "Google Klick-ID", value: "Cj0" },
    ],
  });
  // Without UTM tags TyloHQ marks the lead as "website".
  const plain = tylohqPayload("Kontaktformular", [{ label: "Name", value: "A" }], cleanAttribution({}), "id-2");
  assert.equal("utm_source" in plain, false);
  assert.equal("utm_campaign" in plain, false);
});

test("sending: off without an https URL; never throws; reports TyloHQ's answer", async () => {
  const fields = [{ label: "Name", value: "A" }];
  assert.equal(await sendToTyloHQ("F", fields, cleanAttribution({})), false);
  process.env.TYLOHQ_LEADS_URL = "http://insecure.example/hook";
  assert.equal(await sendToTyloHQ("F", fields, cleanAttribution({})), false);

  const realFetch = globalThis.fetch;
  try {
    process.env.TYLOHQ_LEADS_URL = "https://www.tylohq.de/api/leads/hook/x?key=k";
    let sent: { url: string; body: unknown } | null = null;
    globalThis.fetch = (async (url: string, init: RequestInit) => ((sent = { url, body: JSON.parse(String(init.body)) }), new Response("{}", { status: 200 }))) as typeof fetch;
    assert.equal(await sendToTyloHQ("Kontaktformular", fields, cleanAttribution({ page: "/kontakt" })), true);
    assert.equal(sent!.url, process.env.TYLOHQ_LEADS_URL);
    assert.equal((sent!.body as { form_name: string }).form_name, "Kontaktformular");

    globalThis.fetch = (async () => new Response("{}", { status: 401 })) as typeof fetch;
    assert.equal(await sendToTyloHQ("F", fields, cleanAttribution({})), false);
    globalThis.fetch = (async () => {
      throw new Error("down");
    }) as typeof fetch;
    assert.equal(await sendToTyloHQ("F", fields, cleanAttribution({})), false);
  } finally {
    globalThis.fetch = realFetch;
  }
});
