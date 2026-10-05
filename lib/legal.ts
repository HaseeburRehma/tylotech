/* Legal pages. Wording comes from tylotech.de/impressum and tylotech.de/datenschutzerklarung
   (typos, broken e-mail links and template leftovers corrected). Sections marked `added`
   describe services this site uses that the old text did not cover.
   Inline links use markdown syntax: [label](href). */

export type Block = { p: string } | { ul: string[] } | { h: string } | { lines: string[] };
export type LegalSection = { id: string; title: string; blocks: Block[]; added?: boolean };
export type LegalDoc = { eyebrow: string; title: string; accent: string; intro: string; stand: string; sections: LegalSection[] };

const ADDRESS = ["TyloTech", "Behrenstraße 4", "40233 Düsseldorf"];
const CONTACT_LINES = [
  "E-Mail: [info@tylotech.de](mailto:info@tylotech.de)",
  "Telefon: [+49 173 6022784](tel:+491736022784)",
  "Büro: [0211 15847097](tel:+4921115847097)",
];

export const IMPRESSUM: LegalDoc = {
  eyebrow: "Rechtliches",
  title: "Impressum",
  accent: "",
  intro: "Angaben gemäß § 5 DDG",
  stand: "",
  sections: [
    {
      id: "anbieter",
      title: "Anbieter",
      blocks: [{ lines: ADDRESS }, { lines: CONTACT_LINES }, { h: "Steuernummer" }, { p: "133/5006/3546" }],
    },
    {
      id: "verantwortlicher",
      title: "Verantwortlicher",
      blocks: [{ lines: ["Ilias El Aradi", "Behrenstraße 4", "40233 Düsseldorf"] }],
    },
    {
      id: "links",
      title: "Verweise und Links",
      blocks: [
        {
          p: "Mit dem Urteil vom 12. Mai 1998 hat das Landgericht Hamburg entschieden, dass man durch die Ausbringung eines Links die Inhalte der gelinkten Seite ggf. mit zu verantworten hat. Dies kann – so das Landgericht Hamburg – nur dadurch verhindert werden, dass man sich ausdrücklich von diesen Inhalten distanziert. Wir distanzieren uns deshalb hiermit ausdrücklich von allen Inhalten aller gelinkten Seiten auf dieser Webseite und machen uns deren Inhalte nicht zu eigen. Wir möchten ausdrücklich betonen, dass wir keinerlei Einfluss auf die Gestaltung und die Inhalte der gelinkten Seiten haben.",
        },
      ],
    },
    {
      id: "streitbeilegung",
      title: "Verbraucherstreitbeilegung",
      blocks: [
        { h: "Hinweis gemäß § 36 Verbraucherstreitbeilegungsgesetz (VSBG)" },
        { p: "Wir sind zur Teilnahme an einem Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle weder bereit noch verpflichtet." },
      ],
    },
    {
      id: "haftung",
      title: "Haftungshinweis",
      blocks: [
        {
          p: "Trotz sorgfältiger inhaltlicher Kontrolle übernehmen wir keine Haftung für die Inhalte externer Links. Für den Inhalt der verlinkten Seiten sind ausschließlich deren Betreiber verantwortlich.",
        },
      ],
    },
    {
      id: "copyright",
      title: "Copyright",
      blocks: [
        {
          p: "Das Copyright für veröffentlichte, selbst erstellte Objekte bleibt allein beim Autor der Seiten. Eine Vervielfältigung oder Verwendung solcher Grafiken, Tondokumente, Videosequenzen und Texte in anderen elektronischen oder gedruckten Publikationen ist ohne ausdrückliche Zustimmung der Verantwortlichen nicht gestattet.",
        },
      ],
    },
    {
      id: "plattform",
      title: "Online-Plattform",
      blocks: [
        {
          p: "Besuchen Sie unsere Online-Plattform unter [www.tylotech.de](https://tylotech.de). Für Anfragen und Support können Sie sich an [info@tylotech.de](mailto:info@tylotech.de) wenden.",
        },
      ],
    },
    {
      id: "datenschutz",
      title: "Datenschutzerklärung",
      blocks: [{ p: "Unsere Datenschutzerklärung, die erklärt, wie wir mit personenbezogenen Daten umgehen, finden Sie unter [tylotech.de/datenschutz](/datenschutz)." }],
    },
    {
      id: "urheberrecht",
      title: "Urheberrecht für Online-Inhalte",
      blocks: [{ p: "Alle Inhalte auf unserer Website sind urheberrechtlich geschützt. Die Verwendung ohne Genehmigung ist nicht gestattet." }],
    },
    {
      id: "marken",
      title: "Markenrechte",
      blocks: [{ p: "„TyloTech“ und das TyloTech-Logo sind eingetragene Marken des Unternehmens TyloTech." }],
    },
  ],
};

export const DATENSCHUTZ: LegalDoc = {
  eyebrow: "Rechtliches",
  title: "Datenschutz",
  accent: "erklärung",
  intro: "Diese Datenschutzerklärung informiert über die Verarbeitung personenbezogener Daten auf der Website von TyloTech.",
  stand: "Dezember 2023",
  sections: [
    {
      id: "verantwortlicher",
      title: "Name und Kontaktdaten des Verantwortlichen",
      blocks: [
        { h: "Verantwortlicher" },
        { lines: ADDRESS },
        { h: "Kontaktdaten des Datenschutzbeauftragten" },
        { p: "Der Datenschutzbeauftragte von TyloTech ist unter den folgenden Kontaktdaten erreichbar:" },
        { lines: CONTACT_LINES },
      ],
    },
    {
      id: "aufruf",
      title: "Aufruf der Webseite",
      blocks: [
        {
          p: "Beim Aufruf dieser Webseite [www.tylotech.de](https://tylotech.de) werden durch den Internet-Browser, den der Besucher verwendet, automatisch Daten an den Server dieser Webseite gesendet und zeitlich unbegrenzt in einer Protokolldatei (Logfile) gespeichert. Soweit innerhalb dieser Datenschutzerklärung keine speziellere Speicherdauer genannt wurde, verbleiben Ihre personenbezogenen Daten bei uns, bis der Zweck für die Datenverarbeitung entfällt. Wenn Sie ein berechtigtes Löschersuchen geltend machen oder eine Einwilligung zur Datenverarbeitung widerrufen, werden Ihre Daten gelöscht, sofern wir keine anderen rechtlich zulässigen Gründe für die Speicherung Ihrer personenbezogenen Daten haben (z. B. steuer- oder handelsrechtliche Aufbewahrungsfristen); im letztgenannten Fall erfolgt die Löschung nach Fortfall dieser Gründe. Bis zur Löschung werden nachstehende Daten ohne weitere Eingabe des Besuchers gespeichert:",
        },
        {
          ul: [
            "IP-Adresse des Endgeräts des Besuchers,",
            "Datum und Uhrzeit des Zugriffs durch den Besucher,",
            "Name und URL der vom Besucher aufgerufenen Seite,",
            "Webseite, von der aus der Besucher auf die Webseite gelangt (sog. Referrer-URL),",
            "Browser und Betriebssystem des Endgeräts des Besuchers sowie der Name des vom Besucher verwendeten Access-Providers.",
          ],
        },
        { p: "Die Verarbeitung dieser personenbezogenen Daten ist gem. Art. 6 Abs. 1 Satz 1 Buchst. f) DSGVO gerechtfertigt. TyloTech hat ein berechtigtes Interesse an der Datenverarbeitung zu dem Zweck," },
        {
          ul: [
            "die Verbindung zur Webseite zügig aufzubauen,",
            "eine nutzerfreundliche Anwendung der Webseite zu ermöglichen,",
            "die Sicherheit und Stabilität der Systeme zu erkennen und zu gewährleisten und",
            "die Administration der Webseite zu erleichtern und zu verbessern.",
          ],
        },
        { p: "Die Verarbeitung erfolgt ausdrücklich nicht zu dem Zweck, Erkenntnisse über die Person des Besuchers der Webseite zu gewinnen." },
      ],
    },
    {
      id: "hosting",
      title: "Hosting",
      added: true,
      blocks: [
        {
          p: "Diese Webseite wird bei Vercel Inc. (USA) gehostet. Beim Aufruf der Webseite verarbeitet Vercel die oben unter „Aufruf der Webseite“ genannten Zugriffsdaten, um die Seite auszuliefern und den sicheren Betrieb zu gewährleisten. Rechtsgrundlage ist Art. 6 Abs. 1 Satz 1 Buchst. f) DSGVO; unser berechtigtes Interesse liegt in einer schnellen und zuverlässigen Bereitstellung der Webseite. Weitere Informationen: [vercel.com/legal/privacy-policy](https://vercel.com/legal/privacy-policy).",
        },
      ],
    },
    {
      id: "kontaktformular",
      title: "Kontaktformular",
      blocks: [
        {
          p: "Besucher können über ein Online-Kontaktformular auf der Webseite Nachrichten an TyloTech übermitteln. Pflichtangaben sind Name, eine gültige E-Mail-Adresse, damit wir antworten können, und die Nachricht. Alle weiteren Angaben kann die anfragende Person freiwillig geben. Mit Absenden der Nachricht über das Kontaktformular willigt der Besucher in die Verarbeitung der übermittelten personenbezogenen Daten ein. Die Datenverarbeitung erfolgt ausschließlich zu dem Zweck der Abwicklung und Beantwortung von Anfragen über das Kontaktformular. Dies geschieht auf Basis der freiwillig erteilten Einwilligung gem. Art. 6 Abs. 1 Satz 1 Buchst. a) DSGVO. Die für die Benutzung des Kontaktformulars erhobenen personenbezogenen Daten werden automatisch gelöscht, sobald die Anfrage erledigt ist und keine Gründe für eine weitere Aufbewahrung gegeben sind.",
        },
        {
          p: "Die Anfrage wird über unseren E-Mail-Server bei Microsoft 365 (Microsoft Ireland Operations Limited, One Microsoft Place, South County Business Park, Leopardstown, Dublin 18, Irland) an unser Postfach info@tylotech.de zugestellt. Zusätzlich senden wir dir eine Eingangsbestätigung an die angegebene E-Mail-Adresse.",
        },
      ],
    },
    {
      id: "tylolens",
      title: "TyloLens-Analyse",
      added: true,
      blocks: [
        {
          p: "Über TyloLens kannst du eine kostenlose, persönliche Analyse deines Marketings anfordern. Dafür verarbeiten wir die Adresse deiner Website, deine Branche, dein wichtigstes Ziel, dein ungefähres monatliches Marketing-Budget, deinen Namen und deine E-Mail-Adresse. Wir nutzen diese Angaben ausschließlich, um die Analyse zu erstellen, sie dir als kurzes Video per E-Mail zu senden und deine Anfrage einzuordnen. Rechtsgrundlage ist Art. 6 Abs. 1 Satz 1 Buchst. b) DSGVO (Durchführung vorvertraglicher Maßnahmen auf deine Anfrage). Die Zustellung erfolgt wie beim Kontaktformular über unseren E-Mail-Server bei Microsoft 365. Die Daten werden gelöscht, sobald sie für diesen Zweck nicht mehr erforderlich sind und keine gesetzlichen Aufbewahrungspflichten bestehen.",
        },
      ],
    },
    {
      id: "weitergabe",
      title: "Weitergabe von Daten",
      blocks: [
        { p: "Personenbezogene Daten werden an Dritte übermittelt, wenn" },
        {
          ul: [
            "nach Art. 6 Abs. 1 Satz 1 Buchst. a) DSGVO durch die betroffene Person ausdrücklich dazu eingewilligt wurde,",
            "die Weitergabe nach Art. 6 Abs. 1 Satz 1 Buchst. f) DSGVO zur Geltendmachung, Ausübung oder Verteidigung von Rechtsansprüchen erforderlich ist und kein Grund zur Annahme besteht, dass die betroffene Person ein überwiegendes schutzwürdiges Interesse an der Nichtweitergabe ihrer Daten hat,",
            "für die Datenübermittlung nach Art. 6 Abs. 1 Satz 1 Buchst. c) DSGVO eine gesetzliche Verpflichtung besteht, und/oder",
            "dies nach Art. 6 Abs. 1 Satz 1 Buchst. b) DSGVO für die Erfüllung eines Vertragsverhältnisses mit der betroffenen Person erforderlich ist.",
          ],
        },
        { p: "In anderen Fällen werden personenbezogene Daten nicht an Dritte weitergegeben." },
      ],
    },
    {
      id: "cookies",
      title: "Cookies",
      blocks: [
        {
          p: "Auf der Webseite werden sog. Cookies eingesetzt. Das sind Datenpakete, die zwischen dem Server der Webseite und dem Browser des Besuchers ausgetauscht werden. Diese werden beim Besuch der Webseite von den jeweils verwendeten Geräten (PC, Notebook, Tablet, Smartphone etc.) gespeichert. Cookies können insoweit keine Schäden auf den verwendeten Geräten anrichten. Insbesondere enthalten sie keine Viren oder sonstige Schadsoftware. In den Cookies werden Informationen abgelegt, die sich jeweils im Zusammenhang mit dem spezifisch eingesetzten Endgerät ergeben. TyloTech kann damit keinesfalls unmittelbar Kenntnis von der Identität des Besuchers der Webseite erhalten.",
        },
        {
          p: "Cookies werden nach den Grundeinstellungen der Browser größtenteils akzeptiert. Die Browsereinstellungen können so eingerichtet werden, dass Cookies entweder auf den verwendeten Geräten nicht akzeptiert werden, oder dass jeweils ein besonderer Hinweis erfolgt, bevor ein neuer Cookie angelegt wird. Es wird allerdings darauf hingewiesen, dass die Deaktivierung von Cookies dazu führen kann, dass nicht alle Funktionen der Webseite bestmöglich genutzt werden können.",
        },
        {
          p: "Der Einsatz von Cookies dient dazu, die Nutzung des Webangebots komfortabler zu gestalten. So kann beispielsweise anhand von Session-Cookies nachvollzogen werden, ob der Besucher einzelne Seiten der Webseite bereits besucht hat. Nach Verlassen der Webseite werden diese Session-Cookies automatisch gelöscht.",
        },
        {
          p: "Zur Verbesserung der Benutzerfreundlichkeit werden temporäre Cookies eingesetzt. Sie werden für einen vorübergehenden Zeitraum auf dem Gerät des Besuchers gespeichert. Bei erneutem Besuch der Webseite wird automatisch erkannt, dass der Besucher die Seite bereits zu einem früheren Zeitpunkt aufgerufen hat und welche Eingaben und Einstellungen dabei vorgenommen wurden, um diese nicht wiederholen zu müssen.",
        },
        {
          p: "In Abhängigkeit von Ihrer Einwilligung erfolgt der Einsatz von Cookies außerdem, um die Aufrufe der Webseite zu statistischen Zwecken und zum Zwecke der Verbesserung des Angebotes zu analysieren. Diese Cookies ermöglichen es, bei einem erneuten Besuch automatisch zu erkennen, dass die Webseite bereits zuvor vom Besucher aufgerufen wurde. Hier erfolgt nach einer jeweils festgelegten Zeit eine automatische Löschung der Cookies.",
        },
      ],
    },
    {
      id: "google-maps",
      title: "Google Maps",
      added: true,
      blocks: [
        {
          p: "Auf unserer Kontaktseite kann eine Karte des Dienstes Google Maps angezeigt werden. Anbieter ist die Google Ireland Limited, Gordon House, Barrow Street, Dublin 4, Irland. Die Karte wird erst geladen, wenn Sie in unserer Consent-Box „Funktional“ erlaubt haben oder auf „Karte laden“ klicken. Dabei werden unter anderem Ihre IP-Adresse und Informationen zu Ihrem Browser an Google übertragen; eine Übermittlung in die USA ist möglich. Rechtsgrundlage ist Ihre Einwilligung gem. Art. 6 Abs. 1 Satz 1 Buchst. a) DSGVO, die Sie jederzeit mit Wirkung für die Zukunft widerrufen können. Weitere Informationen: [policies.google.com/privacy](https://policies.google.com/privacy).",
        },
      ],
    },
    {
      id: "youtube",
      title: "YouTube-Videos",
      added: true,
      blocks: [
        {
          p: "Wir binden Videos der Plattform YouTube ein. Anbieter ist die Google Ireland Limited, Gordon House, Barrow Street, Dublin 4, Irland. Wir nutzen dabei den erweiterten Datenschutzmodus (youtube-nocookie.com). Einige Videos starten automatisch und stumm, sobald der jeweilige Bereich sichtbar wird. Sobald ein Video geladen oder abgespielt wird, wird eine Verbindung zu den Servern von YouTube hergestellt; dabei werden unter anderem Ihre IP-Adresse und Informationen zu Ihrem Browser übertragen, eine Übermittlung in die USA ist möglich. Rechtsgrundlage ist Art. 6 Abs. 1 Satz 1 Buchst. f) DSGVO; unser berechtigtes Interesse liegt in einer ansprechenden Darstellung unserer Inhalte. Weitere Informationen: [policies.google.com/privacy](https://policies.google.com/privacy).",
        },
      ],
    },
    {
      id: "analyse",
      title: "Analyse-Dienste für Webseiten, Tracking",
      blocks: [
        { p: "Wir nutzen auf unserer Webseite den Webseiten-Analysedienst Google Analytics." },
        {
          p: "Rechtsgrundlage für die Verwendung der Analyse-Tools ist Ihre Einwilligung in unserer Consent-Box. Diese Einwilligung können Sie jederzeit mit Wirkung für die Zukunft widerrufen. Die Webseitenanalyse liegt im Interesse unserer Agentur und dient der statistischen Erfassung der Seitennutzung zur fortlaufenden Verbesserung unserer Webseite und des Angebots unserer Dienstleistungen.",
        },
      ],
    },
    {
      id: "social-plugins",
      title: "Plugins sozialer Netzwerke (Social Plugins)",
      blocks: [
        { p: "Auf unserer Webseite sind Plugins der nachstehenden sozialen Netzwerke eingebunden: Instagram, Facebook und LinkedIn." },
        {
          p: "Rechtsgrundlage für den Einsatz von Social Plugins ist Ihre Einwilligung in unserer Consent-Box. Diese Einwilligung können Sie jederzeit mit Wirkung für die Zukunft widerrufen. Zweck des Einsatzes von Plugins sozialer Netzwerke ist es, unser Angebot einem breiten Publikum gegenüber bekanntzumachen. Die sozialen Netzwerke sind für den datenschutzkonformen Umgang mit den Daten ihrer Nutzer mit verantwortlich.",
        },
      ],
    },
    {
      id: "rechte",
      title: "Ihre Rechte als betroffene Person",
      blocks: [
        { p: "Soweit Ihre personenbezogenen Daten anlässlich des Besuchs unserer Webseite verarbeitet werden, stehen Ihnen als „betroffene Person“ im Sinne der DSGVO folgende Rechte zu." },
        { h: "Auskunft" },
        {
          p: "Sie können von uns Auskunft darüber verlangen, ob personenbezogene Daten von Ihnen bei uns verarbeitet werden. Kein Auskunftsrecht besteht, wenn die Erteilung der begehrten Informationen gegen die Verschwiegenheitspflicht gem. § 57 Abs. 1 StBerG verstoßen würde oder die Informationen aus sonstigen Gründen, insbesondere wegen eines überwiegenden berechtigten Interesses eines Dritten, geheim gehalten werden müssen. Hiervon abweichend kann eine Pflicht zur Erteilung der Auskunft bestehen, wenn insbesondere unter Berücksichtigung drohender Schäden Ihre Interessen gegenüber dem Geheimhaltungsinteresse überwiegen. Das Auskunftsrecht ist ferner ausgeschlossen, wenn die Daten nur deshalb gespeichert sind, weil sie aufgrund gesetzlicher oder satzungsmäßiger Aufbewahrungsfristen nicht gelöscht werden dürfen oder ausschließlich Zwecken der Datensicherung oder der Datenschutzkontrolle dienen, sofern die Auskunftserteilung einen unverhältnismäßig hohen Aufwand erfordern würde und die Verarbeitung zu anderen Zwecken durch geeignete technische und organisatorische Maßnahmen ausgeschlossen ist. Sofern in Ihrem Fall das Auskunftsrecht nicht ausgeschlossen ist und Ihre personenbezogenen Daten von uns verarbeitet werden, können Sie von uns Auskunft über folgende Informationen verlangen:",
        },
        {
          ul: [
            "Zwecke der Verarbeitung,",
            "Kategorien der von Ihnen verarbeiteten personenbezogenen Daten,",
            "Empfänger oder Kategorien von Empfängern, gegenüber denen Ihre personenbezogenen Daten offengelegt werden, insbesondere bei Empfängern in Drittländern,",
            "falls möglich die geplante Dauer, für die Ihre personenbezogenen Daten gespeichert werden oder, falls dies nicht möglich ist, die Kriterien für die Festlegung der Speicherdauer,",
            "das Bestehen eines Rechts auf Berichtigung oder Löschung oder Einschränkung der Verarbeitung der Sie betreffenden personenbezogenen Daten oder eines Widerspruchsrechts gegen diese Verarbeitung,",
            "das Bestehen eines Beschwerderechts bei einer Aufsichtsbehörde für den Datenschutz,",
            "sofern die personenbezogenen Daten nicht bei Ihnen als betroffene Person erhoben worden sind, die verfügbaren Informationen über die Datenherkunft,",
            "ggf. das Bestehen einer automatisierten Entscheidungsfindung einschließlich Profiling und aussagekräftige Informationen über die involvierte Logik sowie die Tragweite und angestrebten Auswirkungen automatisierter Entscheidungsfindungen,",
            "ggf. im Fall der Übermittlung an Empfänger in Drittländern, sofern kein Beschluss der EU-Kommission über die Angemessenheit des Schutzniveaus nach Art. 45 Abs. 3 DSGVO vorliegt, Informationen darüber, welche geeigneten Garantien gem. Art. 46 Abs. 2 DSGVO zum Schutze der personenbezogenen Daten vorgesehen sind.",
          ],
        },
        { h: "Berichtigung und Vervollständigung" },
        {
          p: "Sofern Sie feststellen, dass uns unrichtige personenbezogene Daten von Ihnen vorliegen, können Sie von uns die unverzügliche Berichtigung dieser unrichtigen Daten verlangen. Bei unvollständigen Sie betreffenden personenbezogenen Daten können Sie die Vervollständigung verlangen.",
        },
        { h: "Löschung" },
        {
          p: "Sie haben ein Recht auf Löschung („Recht auf Vergessenwerden“), sofern die Verarbeitung nicht zur Ausübung des Rechts auf freie Meinungsäußerung, des Rechts auf Information oder zur Erfüllung einer rechtlichen Verpflichtung oder zur Wahrnehmung einer Aufgabe, die im öffentlichen Interesse liegt, erforderlich ist und einer der nachstehenden Gründe zutrifft:",
        },
        {
          ul: [
            "Die personenbezogenen Daten sind für die Zwecke, für die sie verarbeitet wurden, nicht mehr notwendig.",
            "Die Rechtfertigungsgrundlage für die Verarbeitung war ausschließlich Ihre Einwilligung, welche Sie widerrufen haben.",
            "Sie haben Widerspruch gegen die Verarbeitung Ihrer personenbezogenen Daten eingelegt, die wir öffentlich gemacht haben.",
            "Sie haben Widerspruch gegen die Verarbeitung von uns nicht öffentlich gemachter personenbezogener Daten eingelegt und es liegen keine vorrangigen berechtigten Gründe für die Verarbeitung vor.",
            "Ihre personenbezogenen Daten wurden unrechtmäßig verarbeitet.",
            "Die Löschung der personenbezogenen Daten ist zur Erfüllung einer gesetzlichen Verpflichtung, der wir unterliegen, erforderlich.",
          ],
        },
        {
          p: "Kein Anspruch auf Löschung besteht, wenn die Löschung im Falle rechtmäßiger nicht automatisierter Datenverarbeitung wegen der besonderen Art der Speicherung nicht oder nur mit unverhältnismäßig hohem Aufwand möglich und Ihr Interesse an der Löschung gering ist. In diesem Fall tritt an die Stelle einer Löschung die Einschränkung der Verarbeitung.",
        },
        { h: "Einschränkung der Verarbeitung" },
        { p: "Sie können von uns die Einschränkung der Verarbeitung verlangen, wenn einer der nachstehenden Gründe zutrifft:" },
        {
          ul: [
            "Sie bestreiten die Richtigkeit der personenbezogenen Daten. Die Einschränkung kann in diesem Fall für die Dauer verlangt werden, die es uns ermöglicht, die Richtigkeit der Daten zu überprüfen.",
            "Die Verarbeitung ist unrechtmäßig und Sie verlangen statt Löschung die Einschränkung der Nutzung Ihrer personenbezogenen Daten.",
            "Ihre personenbezogenen Daten werden von uns nicht länger für die Zwecke der Verarbeitung benötigt, die Sie jedoch zur Geltendmachung, Ausübung oder Verteidigung von Rechtsansprüchen benötigen.",
            "Sie haben Widerspruch gem. Art. 21 Abs. 1 DSGVO eingelegt. Die Einschränkung der Verarbeitung kann solange verlangt werden, wie noch nicht feststeht, ob unsere berechtigten Gründe gegenüber Ihren Gründen überwiegen.",
          ],
        },
        {
          p: "Einschränkung der Verarbeitung bedeutet, dass die personenbezogenen Daten nur mit Ihrer Einwilligung oder zur Geltendmachung, Ausübung oder Verteidigung von Rechtsansprüchen oder zum Schutz der Rechte einer anderen natürlichen oder juristischen Person oder aus Gründen eines wichtigen öffentlichen Interesses verarbeitet werden. Bevor wir die Einschränkung aufheben, haben wir die Pflicht, Sie darüber zu unterrichten.",
        },
        { h: "Datenübertragbarkeit" },
        {
          p: "Sie haben ein Recht auf Datenübertragbarkeit, sofern die Verarbeitung auf Ihrer Einwilligung (Art. 6 Abs. 1 Satz 1 Buchst. a) oder Art. 9 Abs. 2 Buchst. a) DSGVO) oder auf einem Vertrag beruht, dessen Vertragspartei Sie sind und die Verarbeitung mithilfe automatisierter Verfahren erfolgt. Das Recht auf Datenübertragbarkeit beinhaltet in diesem Fall folgende Rechte, sofern hierdurch nicht die Rechte und Freiheiten anderer Personen beeinträchtigt werden: Sie können von uns verlangen, die personenbezogenen Daten, die Sie uns bereit gestellt haben, in einem strukturierten, gängigen und maschinenlesbaren Format zu erhalten. Sie haben das Recht, diese Daten einem anderen Verantwortlichen ohne Behinderung unserseits zu übermitteln. Soweit technisch machbar, können Sie von uns verlangen, dass wir Ihre personenbezogenen Daten direkt an einen anderen Verantwortlichen übermitteln.",
        },
        { h: "Widerspruch" },
        {
          p: "Sofern die Verarbeitung auf Art. 6 Abs. 1 Satz 1 Buchst. e) DSGVO (Wahrnehmung einer Aufgabe im öffentlichen Interesse oder in Ausübung öffentlicher Gewalt) oder auf Art. 6 Abs. 1 Satz 1 Buchst. f) DSGVO (berechtigtes Interesse des Verantwortlichen oder eines Dritten) beruht, haben Sie das Recht, aus Gründen, die sich aus Ihrer besonderen Situation ergeben, jederzeit gegen die Verarbeitung der Sie betreffenden personenbezogenen Daten Widerspruch einzulegen. Das gilt auch für ein auf Art. 6 Abs. 1 Satz 1 Buchst. e) oder Buchst. f) DSGVO gestütztes Profiling. Nach Ausübung des Widerspruchsrechts verarbeiten wir Ihre personenbezogenen Daten nicht mehr, es sei denn, wir können zwingende schutzwürdige Gründe für die Verarbeitung nachweisen, die Ihre Interessen, Rechte und Freiheiten überwiegen, oder die Verarbeitung dient der Geltendmachung, Ausübung oder Verteidigung von Rechtsansprüchen.",
        },
        {
          p: "Sie können jederzeit Widerspruch gegen die Verarbeitung der Sie betreffenden personenbezogenen Daten zu Zwecken der Direktwerbung einlegen. Das gilt auch für ein Profiling, das mit einer solchen Direktwerbung in Verbindung steht. Nach Ausübung dieses Widerspruchsrechts werden wir die betreffenden personenbezogenen Daten nicht mehr für Zwecke der Direktwerbung verwenden.",
        },
        {
          p: "Sie haben die Möglichkeit, den Widerspruch telefonisch, per E-Mail, ggf. per Telefax oder an unsere zu Beginn dieser Datenschutzerklärung aufgeführte Postadresse unserer Agentur formlos mitzuteilen.",
        },
        { h: "Widerruf einer Einwilligung" },
        {
          p: "Sie haben das Recht, eine erteilte Einwilligung jederzeit mit Wirkung für die Zukunft zu widerrufen. Der Widerruf der Einwilligung kann telefonisch, per E-Mail, ggf. per Telefax oder an unsere Postadresse formlos mitgeteilt werden. Durch den Widerruf wird die Rechtmäßigkeit der Datenverarbeitung, die aufgrund der Einwilligung bis zum Eingang des Widerrufs erfolgt ist, nicht berührt. Nach Eingang des Widerrufs wird die Datenverarbeitung, die ausschließlich auf Ihrer Einwilligung beruhte, eingestellt.",
        },
        { h: "Beschwerde" },
        {
          p: "Wenn Sie der Ansicht sind, dass die Verarbeitung der Sie betreffenden personenbezogenen Daten rechtswidrig ist, können Sie Beschwerde bei einer Aufsichtsbehörde für den Datenschutz einlegen, die für den Ort Ihres Aufenthaltes oder Arbeitsplatzes oder für den Ort des mutmaßlichen Verstoßes zuständig ist.",
        },
      ],
    },
    {
      id: "stand",
      title: "Stand und Aktualisierung dieser Datenschutzerklärung",
      blocks: [
        {
          p: "Diese Datenschutzerklärung hat den Stand Dezember 2023. Wir behalten uns vor, die Datenschutzerklärung zu gegebener Zeit zu aktualisieren, um den Datenschutz zu verbessern und/oder an geänderte Behördenpraxis oder Rechtsprechung anzupassen.",
        },
      ],
    },
  ],
};
