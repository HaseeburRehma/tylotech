import type { LegalDoc, LegalSection } from "./legal";

/* English translations of the legal pages. Section ids match lib/legal.ts so anchors work in
   both languages; the only extra section is the note on the binding version, placed first.
   Inline links use markdown syntax: [label](href). */

const ADDRESS = ["TyloTech", "Behrenstraße 4", "40233 Düsseldorf", "Germany"];
const CONTACT_LINES = [
  "Email: [info@tylotech.de](mailto:info@tylotech.de)",
  "Phone: [+49 173 6022784](tel:+491736022784)",
  "Office: [+49 211 15847097](tel:+4921115847097)",
];

const BINDING_NOTE: LegalSection = {
  id: "english-version",
  title: "Note on this translation",
  blocks: [{ p: "This English version is provided for convenience. Only the German version is legally binding." }],
};

export const IMPRESSUM_EN: LegalDoc = {
  eyebrow: "Legal",
  title: "Legal ",
  accent: "Notice",
  intro: "Information pursuant to § 5 DDG (German Digital Services Act)",
  stand: "",
  sections: [
    BINDING_NOTE,
    {
      id: "anbieter",
      title: "Provider",
      blocks: [{ lines: ADDRESS }, { lines: CONTACT_LINES }, { h: "Tax number" }, { p: "133/5006/3546" }],
    },
    {
      id: "verantwortlicher",
      title: "Responsible person",
      blocks: [{ lines: ["Ilias El Aradi", "Behrenstraße 4", "40233 Düsseldorf", "Germany"] }],
    },
    {
      id: "links",
      title: "References and links",
      blocks: [
        {
          p: "In its judgment of 12 May 1998, the Regional Court (Landgericht) of Hamburg ruled that by placing a link, one may share responsibility for the content of the linked page. According to the Regional Court of Hamburg, this can only be prevented by expressly dissociating oneself from that content. We therefore hereby expressly dissociate ourselves from all content of all linked pages on this website and do not adopt their content as our own. We wish to stress expressly that we have no influence whatsoever on the design or content of the linked pages.",
        },
      ],
    },
    {
      id: "streitbeilegung",
      title: "Consumer dispute resolution",
      blocks: [
        { h: "Notice pursuant to § 36 of the German Consumer Dispute Resolution Act (VSBG)" },
        { p: "We are neither willing nor obliged to participate in dispute resolution proceedings before a consumer arbitration board." },
      ],
    },
    {
      id: "haftung",
      title: "Disclaimer",
      blocks: [
        {
          p: "Despite careful checks of the content, we accept no liability for the content of external links. The operators of the linked pages are solely responsible for their content.",
        },
      ],
    },
    {
      id: "copyright",
      title: "Copyright",
      blocks: [
        {
          p: "The copyright for published objects created by the author remains solely with the author of these pages. Any reproduction or use of such graphics, audio documents, video sequences and texts in other electronic or printed publications is not permitted without the express consent of the persons responsible.",
        },
      ],
    },
    {
      id: "plattform",
      title: "Online platform",
      blocks: [
        {
          p: "Visit our online platform at [www.tylotech.de](https://tylotech.de). For enquiries and support, please contact [info@tylotech.de](mailto:info@tylotech.de).",
        },
      ],
    },
    {
      id: "datenschutz",
      title: "Privacy policy",
      blocks: [{ p: "Our privacy policy, which explains how we handle personal data, can be found at [tylotech.de/en/privacy](/en/privacy)." }],
    },
    {
      id: "urheberrecht",
      title: "Copyright in online content",
      blocks: [{ p: "All content on our website is protected by copyright. Any use without permission is prohibited." }],
    },
    {
      id: "marken",
      title: "Trademarks",
      blocks: [{ p: "‘TyloTech’ and the TyloTech logo are registered trademarks of TyloTech." }],
    },
  ],
};

export const DATENSCHUTZ_EN: LegalDoc = {
  eyebrow: "Legal",
  title: "Privacy ",
  accent: "Policy",
  intro: "This privacy policy explains how personal data is processed on the TyloTech website.",
  stand: "December 2023",
  sections: [
    BINDING_NOTE,
    {
      id: "verantwortlicher",
      title: "Name and contact details of the controller",
      blocks: [
        { h: "Controller" },
        { lines: ADDRESS },
        { h: "Contact details of the data protection officer" },
        { p: "TyloTech’s data protection officer can be reached using the following contact details:" },
        { lines: CONTACT_LINES },
      ],
    },
    {
      id: "aufruf",
      title: "Accessing the website",
      blocks: [
        {
          p: "When this website [www.tylotech.de](https://tylotech.de) is accessed, the internet browser used by the visitor automatically sends data to the server of this website, where it is stored in a log file for an unlimited period. Unless a more specific storage period is stated in this privacy policy, your personal data will remain with us until the purpose for which it was processed no longer applies. If you submit a justified request for erasure or withdraw your consent to data processing, your data will be erased unless we have other legally permissible grounds for storing your personal data (e.g. retention periods under tax or commercial law); in the latter case, the data will be erased once those grounds cease to apply. Until erasure, the following data is stored without any further input from the visitor:",
        },
        {
          ul: [
            "the IP address of the visitor’s device,",
            "the date and time of access by the visitor,",
            "the name and URL of the page accessed by the visitor,",
            "the website from which the visitor reached this website (referrer URL),",
            "the browser and operating system of the visitor’s device and the name of the access provider used by the visitor.",
          ],
        },
        { p: "The processing of this personal data is justified under Art. 6(1)(f) GDPR. TyloTech has a legitimate interest in processing the data for the purpose of" },
        {
          ul: [
            "establishing a fast connection to the website,",
            "enabling user-friendly use of the website,",
            "detecting and ensuring the security and stability of the systems, and",
            "facilitating and improving the administration of the website.",
          ],
        },
        { p: "The processing is expressly not carried out for the purpose of gaining insights into the identity of the website visitor." },
      ],
    },
    {
      id: "hosting",
      title: "Hosting",
      added: true,
      blocks: [
        {
          p: "This website is hosted by Vercel Inc. (USA). When the website is accessed, Vercel processes the access data listed above under ‘Accessing the website’ in order to deliver the pages and ensure secure operation. The legal basis is Art. 6(1)(f) GDPR; our legitimate interest lies in providing the website quickly and reliably. Further information: [vercel.com/legal/privacy-policy](https://vercel.com/legal/privacy-policy).",
        },
      ],
    },
    {
      id: "kontaktformular",
      title: "Contact form",
      blocks: [
        {
          p: "Visitors can send messages to TyloTech via an online contact form on the website. Mandatory fields are the name, a valid email address so that we can reply, and the message. All other information may be provided voluntarily by the person making the enquiry. By sending the message via the contact form, the visitor consents to the processing of the personal data transmitted. The data is processed exclusively for the purpose of handling and responding to enquiries submitted via the contact form. The legal basis is the voluntarily given consent pursuant to Art. 6(1)(a) GDPR. The personal data collected for the use of the contact form is erased automatically as soon as the enquiry has been dealt with and there are no grounds for further retention.",
        },
        {
          p: "The enquiry is delivered to our mailbox info@tylotech.de via our email server at Microsoft 365 (Microsoft Ireland Operations Limited, One Microsoft Place, South County Business Park, Leopardstown, Dublin 18, Ireland). In addition, we send you a confirmation of receipt to the email address you provided.",
        },
      ],
    },
    {
      id: "tylolens",
      title: "TyloLens analysis",
      added: true,
      blocks: [
        {
          p: "Via TyloLens, you can request a free, personal analysis of your marketing. For this purpose, we process the address of your website, your industry, your main goal, your approximate monthly marketing budget, your name and your email address. We use this information exclusively to prepare the analysis, to send it to you by email as a short video and to classify your request. The legal basis is Art. 6(1)(b) GDPR (taking steps at your request prior to entering into a contract). As with the contact form, delivery takes place via our email server at Microsoft 365. The data is erased as soon as it is no longer required for this purpose and no statutory retention obligations apply.",
        },
      ],
    },
    {
      id: "weitergabe",
      title: "Disclosure of data",
      blocks: [
        { p: "Personal data is transferred to third parties if" },
        {
          ul: [
            "the data subject has given their express consent to this pursuant to Art. 6(1)(a) GDPR,",
            "the disclosure is necessary pursuant to Art. 6(1)(f) GDPR for the establishment, exercise or defence of legal claims and there is no reason to assume that the data subject has an overriding legitimate interest in their data not being disclosed,",
            "there is a legal obligation to transfer the data pursuant to Art. 6(1)(c) GDPR, and/or",
            "this is necessary pursuant to Art. 6(1)(b) GDPR for the performance of a contract with the data subject.",
          ],
        },
        { p: "In all other cases, personal data is not disclosed to third parties." },
      ],
    },
    {
      id: "cookies",
      title: "Cookies",
      blocks: [
        {
          p: "This website uses cookies. Cookies are data packets exchanged between the website’s server and the visitor’s browser. They are stored by the devices used (PC, notebook, tablet, smartphone, etc.) when the website is visited. Cookies cannot cause any damage to the devices used; in particular, they do not contain viruses or other malware. Cookies store information relating to the specific device used. Under no circumstances can TyloTech thereby gain direct knowledge of the identity of the website visitor.",
        },
        {
          p: "Most browsers accept cookies by default. Browser settings can be configured so that cookies are either not accepted on the devices used or a specific notice is displayed before a new cookie is created. Please note, however, that disabling cookies may mean that not all functions of the website can be used to their full extent.",
        },
        {
          p: "Cookies are used to make the website more convenient to use. For example, session cookies make it possible to determine whether the visitor has already visited individual pages of the website. These session cookies are deleted automatically when the visitor leaves the website.",
        },
        {
          p: "Temporary cookies are used to improve user-friendliness. They are stored on the visitor’s device for a limited period. When the visitor returns to the website, it is automatically recognised that the visitor has accessed the site before and which entries and settings were made, so that they do not have to be repeated.",
        },
        {
          p: "Subject to your consent, cookies are also used to analyse visits to the website for statistical purposes and to improve our offering. These cookies make it possible to recognise automatically on a subsequent visit that the visitor has already accessed the website. These cookies are deleted automatically after a defined period.",
        },
      ],
    },
    {
      id: "google-maps",
      title: "Google Maps",
      added: true,
      blocks: [
        {
          p: "A map from the Google Maps service may be displayed on our contact page. The provider is Google Ireland Limited, Gordon House, Barrow Street, Dublin 4, Ireland. The map is only loaded once you have allowed ‘Functional’ in our consent box or click ‘Load map’. In doing so, your IP address and information about your browser, among other things, are transmitted to Google; a transfer to the USA is possible. The legal basis is your consent pursuant to Art. 6(1)(a) GDPR, which you can withdraw at any time with effect for the future. Further information: [policies.google.com/privacy](https://policies.google.com/privacy).",
        },
      ],
    },
    {
      id: "youtube",
      title: "YouTube videos",
      added: true,
      blocks: [
        {
          p: "We embed videos from the YouTube platform. The provider is Google Ireland Limited, Gordon House, Barrow Street, Dublin 4, Ireland. We use the privacy-enhanced mode (youtube-nocookie.com). Some videos start automatically and muted as soon as the relevant section becomes visible. As soon as a video is loaded or played, a connection to YouTube’s servers is established; in doing so, your IP address and information about your browser, among other things, are transmitted, and a transfer to the USA is possible. The legal basis is Art. 6(1)(f) GDPR; our legitimate interest lies in presenting our content in an appealing manner. Further information: [policies.google.com/privacy](https://policies.google.com/privacy).",
        },
      ],
    },
    {
      id: "analyse",
      title: "Website analysis services and tracking",
      blocks: [
        { p: "We use the web analytics service Google Analytics on our website." },
        {
          p: "The legal basis for the use of the analysis tools is the consent you give in our consent box. You can withdraw this consent at any time with effect for the future. Website analysis is in the interest of our agency and serves the statistical recording of page usage in order to continuously improve our website and the services we offer.",
        },
      ],
    },
    {
      id: "social-plugins",
      title: "Social network plugins (social plugins)",
      blocks: [
        { p: "Plugins of the following social networks are integrated into our website: Instagram, Facebook and LinkedIn." },
        {
          p: "The legal basis for the use of social plugins is the consent you give in our consent box. You can withdraw this consent at any time with effect for the future. The purpose of using social network plugins is to make our services known to a wide audience. The social networks are jointly responsible for handling their users’ data in compliance with data protection law.",
        },
      ],
    },
    {
      id: "rechte",
      title: "Your rights as a data subject",
      blocks: [
        { p: "Where your personal data is processed in connection with your visit to our website, you have the following rights as a ‘data subject’ within the meaning of the GDPR." },
        { h: "Access" },
        {
          p: "You may request information from us as to whether we process personal data concerning you. There is no right of access where providing the requested information would breach the duty of confidentiality under § 57(1) of the German Tax Advisers Act (StBerG) or where the information must be kept secret for other reasons, in particular because of an overriding legitimate interest of a third party. By way of derogation, there may be an obligation to provide the information if your interests outweigh the interest in confidentiality, taking into account in particular any threatened harm. The right of access is also excluded where the data is stored only because it may not be erased owing to statutory or statutory-instrument retention periods, or serves exclusively for data backup or data protection control purposes, provided that providing the information would require disproportionate effort and processing for other purposes is excluded by appropriate technical and organisational measures. If your right of access is not excluded in your case and we process your personal data, you may request the following information from us:",
        },
        {
          ul: [
            "the purposes of the processing,",
            "the categories of personal data concerning you that are processed,",
            "the recipients or categories of recipients to whom your personal data is disclosed, in particular recipients in third countries,",
            "where possible, the envisaged period for which your personal data will be stored or, if that is not possible, the criteria used to determine that period,",
            "the existence of the right to request rectification or erasure of personal data concerning you or restriction of its processing, or to object to such processing,",
            "the existence of the right to lodge a complaint with a data protection supervisory authority,",
            "where the personal data was not collected from you as the data subject, any available information as to its source,",
            "where applicable, the existence of automated decision-making, including profiling, and meaningful information about the logic involved, as well as the significance and envisaged consequences of such automated decision-making,",
            "where applicable, in the case of a transfer to recipients in third countries for which there is no adequacy decision of the European Commission pursuant to Art. 45(3) GDPR, information on the appropriate safeguards provided for pursuant to Art. 46(2) GDPR to protect the personal data.",
          ],
        },
        { h: "Rectification and completion" },
        {
          p: "If you find that we hold inaccurate personal data about you, you may request that we rectify this inaccurate data without undue delay. If personal data concerning you is incomplete, you may request that it be completed.",
        },
        { h: "Erasure" },
        {
          p: "You have the right to erasure (‘right to be forgotten’) unless the processing is necessary for exercising the right of freedom of expression and information, for compliance with a legal obligation or for the performance of a task carried out in the public interest, and one of the following grounds applies:",
        },
        {
          ul: [
            "The personal data is no longer necessary in relation to the purposes for which it was processed.",
            "The sole legal basis for the processing was your consent, which you have withdrawn.",
            "You have objected to the processing of your personal data that we have made public.",
            "You have objected to the processing of personal data that we have not made public, and there are no overriding legitimate grounds for the processing.",
            "Your personal data has been processed unlawfully.",
            "The erasure of the personal data is necessary for compliance with a legal obligation to which we are subject.",
          ],
        },
        {
          p: "There is no right to erasure where, in the case of lawful non-automated data processing, erasure is impossible or only possible with disproportionate effort owing to the particular manner of storage, and your interest in erasure is minimal. In this case, erasure is replaced by restriction of processing.",
        },
        { h: "Restriction of processing" },
        { p: "You may request that we restrict processing if one of the following grounds applies:" },
        {
          ul: [
            "You contest the accuracy of the personal data. In this case, restriction may be requested for a period enabling us to verify the accuracy of the data.",
            "The processing is unlawful and you request the restriction of the use of your personal data instead of its erasure.",
            "We no longer need your personal data for the purposes of the processing, but you require it for the establishment, exercise or defence of legal claims.",
            "You have objected pursuant to Art. 21(1) GDPR. Restriction of processing may be requested for as long as it has not yet been established whether our legitimate grounds override yours.",
          ],
        },
        {
          p: "Restriction of processing means that the personal data is only processed with your consent, for the establishment, exercise or defence of legal claims, for the protection of the rights of another natural or legal person, or for reasons of important public interest. We are obliged to inform you before the restriction is lifted.",
        },
        { h: "Data portability" },
        {
          p: "You have the right to data portability where the processing is based on your consent (Art. 6(1)(a) or Art. 9(2)(a) GDPR) or on a contract to which you are a party, and the processing is carried out by automated means. In this case, the right to data portability includes the following rights, provided that this does not adversely affect the rights and freedoms of others: you may request to receive the personal data you have provided to us in a structured, commonly used and machine-readable format. You have the right to transmit this data to another controller without hindrance from us. Where technically feasible, you may request that we transmit your personal data directly to another controller.",
        },
        { h: "Objection" },
        {
          p: "Where the processing is based on Art. 6(1)(e) GDPR (performance of a task carried out in the public interest or in the exercise of official authority) or on Art. 6(1)(f) GDPR (legitimate interest of the controller or of a third party), you have the right to object at any time, on grounds relating to your particular situation, to the processing of personal data concerning you. This also applies to profiling based on Art. 6(1)(e) or (f) GDPR. Once you have exercised your right to object, we will no longer process your personal data unless we can demonstrate compelling legitimate grounds for the processing which override your interests, rights and freedoms, or the processing serves the establishment, exercise or defence of legal claims.",
        },
        {
          p: "You may object at any time to the processing of personal data concerning you for direct marketing purposes. This also applies to profiling to the extent that it is related to such direct marketing. Once you have exercised this right to object, we will no longer use the personal data concerned for direct marketing purposes.",
        },
        {
          p: "You may notify us of your objection informally by telephone, by email, where applicable by fax, or by post to our agency’s postal address stated at the beginning of this privacy policy.",
        },
        { h: "Withdrawal of consent" },
        {
          p: "You have the right to withdraw any consent you have given at any time with effect for the future. You may notify us of the withdrawal of your consent informally by telephone, by email, where applicable by fax, or by post to our postal address. The withdrawal does not affect the lawfulness of the processing carried out on the basis of the consent before the withdrawal was received. Once the withdrawal has been received, any processing based exclusively on your consent will cease.",
        },
        { h: "Complaint" },
        {
          p: "If you believe that the processing of personal data concerning you is unlawful, you may lodge a complaint with a data protection supervisory authority competent for your place of residence or work or for the place of the alleged infringement.",
        },
      ],
    },
    {
      id: "stand",
      title: "Date and updates of this privacy policy",
      blocks: [
        {
          p: "This privacy policy is current as of December 2023. We reserve the right to update this privacy policy in due course in order to improve data protection and/or to adapt it to changes in official practice or case law.",
        },
      ],
    },
  ],
};
