import type { Locale } from "./locales";

export type MessageKey =
  | "nav.newCheck"
  | "nav.search"
  | "nav.about"
  | "nav.myChecks"
  | "nav.noChecks"
  | "nav.noResults"
  | "nav.apiKey"
  | "nav.apiKeyDesc"
  | "nav.save"
  | "nav.localContext"
  | "nav.localContextText"
  | "nav.searchPlaceholder"
  | "nav.deleteCheck"
  | "nav.deleteConfirm"
  | "header.searchPlaceholder"
  | "header.notifications"
  | "header.about"
  | "header.language"
  | "chat.greeting"
  | "chat.subtitle"
  | "chat.tagline"
  | "chat.placeholder"
  | "chat.placeholderWithFile"
  | "chat.attach"
  | "chat.send"
  | "chat.copy"
  | "chat.regenerate"
  | "chat.noResponse"
  | "chat.error"
  | "chat.fileFormats"
  | "chat.fileAttached"
  | "chat.sources"
  | "chat.evidence"
  | "chat.reliability"
  | "chat.proofs"
  | "auth.login"
  | "auth.register"
  | "auth.email"
  | "auth.password"
  | "auth.name"
  | "auth.confirmPassword"
  | "auth.submitLogin"
  | "auth.submitRegister"
  | "auth.remember"
  | "auth.noAccount"
  | "auth.hasAccount"
  | "auth.loginSubtitle"
  | "auth.registerSubtitle"
  | "auth.logout"
  | "auth.savedChecks"
  | "auth.loginError"
  | "auth.registerError"
  | "about.title"
  | "about.back"
  | "about.whyTitle"
  | "about.whyP1"
  | "about.whyP2"
  | "about.utilityTitle"
  | "about.utility1Title"
  | "about.utility1Text"
  | "about.utility2Title"
  | "about.utility2Text"
  | "about.utility3Title"
  | "about.utility3Text"
  | "about.creatorTitle"
  | "about.creatorRole"
  | "about.creatorBio"
  | "about.footer"
  | "about.phone"
  | "about.email"
  | "about.github"
  | "about.linkedin"
  | "fact.yes"
  | "fact.no"
  | "fact.uncertain"
  | "fact.confidence"
  | "common.cancel"
  | "common.close"
  | "common.loading";

export const messages: Record<Locale, Record<MessageKey, string>> = {
  fr: {
    "nav.newCheck": "Nouvelle vérification",
    "nav.search": "Rechercher",
    "nav.about": "À propos",
    "nav.myChecks": "Mes vérifications",
    "nav.noChecks": "Aucune vérification enregistrée",
    "nav.noResults": "Aucun résultat pour « {query} »",
    "nav.apiKey": "Clé API",
    "nav.apiKeyDesc":
      "Entrez votre clé API pour activer les fonctionnalités avancées.",
    "nav.save": "Enregistrer",
    "nav.localContext": "Contexte local",
    "nav.localContextText":
      "Croisez toujours avec radio communautaire, ONG et témoins avant de diffuser une info.",
    "nav.searchPlaceholder": "Rechercher une vérification...",
    "nav.deleteCheck": "Supprimer",
    "nav.deleteConfirm": "Supprimer cette vérification de l'historique ?",
    "header.searchPlaceholder": "Rechercher...",
    "header.notifications": "Notifications",
    "header.about": "À propos",
    "header.language": "Langue",
    "chat.greeting": "Bonjour, {name}",
    "chat.subtitle": "Assistant de vérification des faits",
    "chat.tagline":
      "Vérifiez une rumeur, un message ou un document en quelques secondes",
    "chat.placeholder":
      "Posez une question ou décrivez l'information à vérifier...",
    "chat.placeholderWithFile":
      "Décrivez ce que vous voulez vérifier dans ce fichier...",
    "chat.attach": "Joindre un fichier",
    "chat.send": "Envoyer",
    "chat.copy": "Copier",
    "chat.regenerate": "Régénérer",
    "chat.noResponse": "Aucune réponse reçue",
    "chat.error": "Une erreur est survenue. Veuillez réessayer.",
    "chat.fileFormats": "Formats acceptés : JPG, PNG, PDF",
    "chat.fileAttached": "Fichier joint",
    "chat.sources": "Sources",
    "chat.evidence": "Preuves",
    "chat.reliability": "Fiabilité",
    "chat.proofs": "Éléments de preuve",
    "auth.login": "Connexion",
    "auth.register": "Inscription",
    "auth.email": "Adresse e-mail",
    "auth.password": "Mot de passe",
    "auth.name": "Nom complet",
    "auth.confirmPassword": "Confirmer le mot de passe",
    "auth.submitLogin": "Se connecter",
    "auth.submitRegister": "S'inscrire",
    "auth.remember": "Se souvenir de moi",
    "auth.noAccount": "Pas encore de compte ?",
    "auth.hasAccount": "Déjà un compte ?",
    "auth.loginSubtitle":
      "Connectez-vous pour accéder à vos vérifications sauvegardées",
    "auth.registerSubtitle":
      "Créez un compte pour sauvegarder vos vérifications",
    "auth.logout": "Déconnexion",
    "auth.savedChecks": "Vérifications sauvegardées",
    "auth.loginError": "Identifiants incorrects",
    "auth.registerError": "Erreur lors de l'inscription",
    "about.title": "À propos de CHUNGUZA",
    "about.back": "Retour",
    "about.whyTitle": "Pourquoi CHUNGUZA ?",
    "about.whyP1":
      "Au Nord-Kivu, les rumeurs circulent vite (WhatsApp, radio, bouche à oreille) dans un contexte de conflit armé où une fausse information peut mettre des vies en danger ou attiser les tensions.",
    "about.whyP2":
      "CHUNGUZA aide les citoyens, journalistes communautaires et acteurs humanitaires à vérifier rapidement une affirmation, un message ou un document (image / PDF), en croisant des sources crédibles et en affichant un verdict clair : Oui ou Non, avec un niveau de confiance.",
    "about.utilityTitle": "Comment CHUNGUZA vous aide",
    "about.utility1Title": "Vérification rapide",
    "about.utility1Text":
      "Soumettez une affirmation, un message WhatsApp ou un document et obtenez un verdict en quelques secondes.",
    "about.utility2Title": "Sources crédibles",
    "about.utility2Text":
      "CHUNGUZA croise plusieurs sources fiables pour évaluer la véracité d'une information.",
    "about.utility3Title": "Verdict clair",
    "about.utility3Text":
      "Obtenez une réponse Oui ou Non avec un niveau de confiance pour prendre une décision éclairée.",
    "about.creatorTitle": "Créateur",
    "about.creatorRole": "Développeur et chercheur",
    "about.creatorBio":
      "CHUNGUZA a été conçu pour renforcer la résilience informationnelle au Nord-Kivu, en soutenant les citoyens et les acteurs locaux face à la désinformation.",
    "about.footer": "CHUNGUZA, vérification des faits pour le Nord-Kivu",
    "about.phone": "Téléphone",
    "about.email": "E-mail",
    "about.github": "GitHub",
    "about.linkedin": "LinkedIn",
    "fact.yes": "Oui",
    "fact.no": "Non",
    "fact.uncertain": "Incertain",
    "fact.confidence": "Confiance",
    "common.cancel": "Annuler",
    "common.close": "Fermer",
    "common.loading": "Chargement...",
  },

  en: {
    "nav.newCheck": "New check",
    "nav.search": "Search",
    "nav.about": "About",
    "nav.myChecks": "My checks",
    "nav.noChecks": "No saved checks",
    "nav.noResults": "No results for \"{query}\"",
    "nav.apiKey": "API key",
    "nav.apiKeyDesc": "Enter your API key to enable advanced features.",
    "nav.save": "Save",
    "nav.localContext": "Local context",
    "nav.localContextText":
      "Always cross-check with community radio, NGOs, and witnesses before sharing information.",
    "nav.searchPlaceholder": "Search a check...",
    "nav.deleteCheck": "Delete",
    "nav.deleteConfirm": "Delete this check from history?",
    "header.searchPlaceholder": "Search...",
    "header.notifications": "Notifications",
    "header.about": "About",
    "header.language": "Language",
    "chat.greeting": "Hello, {name}",
    "chat.subtitle": "Fact-checking assistant",
    "chat.tagline": "Verify a rumor, message, or document in seconds",
    "chat.placeholder": "Ask a question or describe the information to verify...",
    "chat.placeholderWithFile":
      "Describe what you want to verify in this file...",
    "chat.attach": "Attach file",
    "chat.send": "Send",
    "chat.copy": "Copy",
    "chat.regenerate": "Regenerate",
    "chat.noResponse": "No response received",
    "chat.error": "An error occurred. Please try again.",
    "chat.fileFormats": "Accepted formats: JPG, PNG, PDF",
    "chat.fileAttached": "File attached",
    "chat.sources": "Sources",
    "chat.evidence": "Evidence",
    "chat.reliability": "Reliability",
    "chat.proofs": "Supporting evidence",
    "auth.login": "Log in",
    "auth.register": "Sign up",
    "auth.email": "Email address",
    "auth.password": "Password",
    "auth.name": "Full name",
    "auth.confirmPassword": "Confirm password",
    "auth.submitLogin": "Log in",
    "auth.submitRegister": "Sign up",
    "auth.remember": "Remember me",
    "auth.noAccount": "Don't have an account?",
    "auth.hasAccount": "Already have an account?",
    "auth.loginSubtitle": "Log in to access your saved checks",
    "auth.registerSubtitle": "Create an account to save your checks",
    "auth.logout": "Log out",
    "auth.savedChecks": "Saved checks",
    "auth.loginError": "Incorrect credentials",
    "auth.registerError": "Registration error",
    "about.title": "About CHUNGUZA",
    "about.back": "Back",
    "about.whyTitle": "Why CHUNGUZA?",
    "about.whyP1":
      "In North Kivu, rumors spread quickly (WhatsApp, radio, word of mouth) in a context of armed conflict where false information can endanger lives or fuel tensions.",
    "about.whyP2":
      "CHUNGUZA helps citizens, community journalists, and humanitarian workers quickly verify a claim, message, or document (image / PDF), by cross-referencing credible sources and displaying a clear verdict: Yes or No, with a confidence level.",
    "about.utilityTitle": "How CHUNGUZA helps you",
    "about.utility1Title": "Quick verification",
    "about.utility1Text":
      "Submit a claim, WhatsApp message, or document and get a verdict in seconds.",
    "about.utility2Title": "Credible sources",
    "about.utility2Text":
      "CHUNGUZA cross-references multiple reliable sources to assess the truth of information.",
    "about.utility3Title": "Clear verdict",
    "about.utility3Text":
      "Get a Yes or No answer with a confidence level to make an informed decision.",
    "about.creatorTitle": "Creator",
    "about.creatorRole": "Developer and researcher",
    "about.creatorBio":
      "CHUNGUZA was designed to strengthen information resilience in North Kivu, supporting citizens and local actors against disinformation.",
    "about.footer": "CHUNGUZA, fact-checking for North Kivu",
    "about.phone": "Phone",
    "about.email": "Email",
    "about.github": "GitHub",
    "about.linkedin": "LinkedIn",
    "fact.yes": "Yes",
    "fact.no": "No",
    "fact.uncertain": "Uncertain",
    "fact.confidence": "Confidence",
    "common.cancel": "Cancel",
    "common.close": "Close",
    "common.loading": "Loading...",
  },

  sw: {
    "nav.newCheck": "Ukaguzi mpya",
    "nav.search": "Tafuta",
    "nav.about": "Kuhusu",
    "nav.myChecks": "Ukaguzi wangu",
    "nav.noChecks": "Hakuna ukaguzi uliowekwa",
    "nav.noResults": "Hakuna matokeo ya \"{query}\"",
    "nav.apiKey": "Ufunguo wa API",
    "nav.apiKeyDesc": "Weka ufunguo wako wa API kuwezesha vipengele vya hali ya juu.",
    "nav.save": "Hifadhi",
    "nav.localContext": "Muktadha wa ndani",
    "nav.localContextText":
      "Daima thibitisha na redio ya jamii, mashirika yasiyo ya kiserikali na mashahidi kabla ya kusambaza habari.",
    "nav.searchPlaceholder": "Tafuta ukaguzi...",
    "nav.deleteCheck": "Futa",
    "nav.deleteConfirm": "Futa ukaguzi huu kutoka historia?",
    "header.searchPlaceholder": "Tafuta...",
    "header.notifications": "Arifa",
    "header.about": "Kuhusu",
    "header.language": "Lugha",
    "chat.greeting": "Habari, {name}",
    "chat.subtitle": "Msaidizi wa ukaguzi wa ukweli",
    "chat.tagline": "Thibitisha uvumi, ujumbe au hati kwa sekunde chache",
    "chat.placeholder": "Uliza swali au elezea habari unayotaka kuthibitisha...",
    "chat.placeholderWithFile":
      "Eleza unachotaka kuthibitisha katika faili hii...",
    "chat.attach": "Ambatisha faili",
    "chat.send": "Tuma",
    "chat.copy": "Nakili",
    "chat.regenerate": "Tengeneza upya",
    "chat.noResponse": "Hakuna jibu lililopokelewa",
    "chat.error": "Hitilafu imetokea. Tafadhali jaribu tena.",
    "chat.fileFormats": "Miundo inayokubalika: JPG, PNG, PDF",
    "chat.fileAttached": "Faili imeambatishwa",
    "chat.sources": "Vyanzo",
    "chat.evidence": "Ushahidi",
    "chat.reliability": "Uaminifu",
    "chat.proofs": "Vielelezo vya ushahidi",
    "auth.login": "Ingia",
    "auth.register": "Jisajili",
    "auth.email": "Barua pepe",
    "auth.password": "Nenosiri",
    "auth.name": "Jina kamili",
    "auth.confirmPassword": "Thibitisha nenosiri",
    "auth.submitLogin": "Ingia",
    "auth.submitRegister": "Jisajili",
    "auth.remember": "Nikumbuke",
    "auth.noAccount": "Huna akaunti?",
    "auth.hasAccount": "Tayari una akaunti?",
    "auth.loginSubtitle": "Ingia ili kufikia ukaguzi wako uliowekwa",
    "auth.registerSubtitle": "Fungua akaunti ili kuhifadhi ukaguzi wako",
    "auth.logout": "Toka",
    "auth.savedChecks": "Ukaguzi uliowekwa",
    "auth.loginError": "Taarifa za kuingia si sahihi",
    "auth.registerError": "Hitilafu wakati wa kujisajili",
    "about.title": "Kuhusu CHUNGUZA",
    "about.back": "Rudi",
    "about.whyTitle": "Kwa nini CHUNGUZA?",
    "about.whyP1":
      "Kaskazini mwa Kivu, uvumi unaenea haraka (WhatsApp, redio, mdomo kwa mdomo) katika mazingira ya migogoro ya silaha ambapo habari za uongo zinaweza kuhatarisha maisha au kuongeza mvutano.",
    "about.whyP2":
      "CHUNGUZA huwasaidia raia, wanahabari wa jamii na wafanyakazi wa kibinadamu kuthibitisha haraka dai, ujumbe au hati (picha / PDF), kwa kulinganisha vyanzo vya kuaminika na kuonyesha hukumu wazi: Ndiyo au Hapana, pamoja na kiwango cha uaminifu.",
    "about.utilityTitle": "Jinsi CHUNGUZA inavyokusaidia",
    "about.utility1Title": "Ukaguzi wa haraka",
    "about.utility1Text":
      "Wasilisha dai, ujumbe wa WhatsApp au hati na upate hukumu kwa sekunde chache.",
    "about.utility2Title": "Vyanzo vya kuaminika",
    "about.utility2Text":
      "CHUNGUZA hulinganisha vyanzo vingi vya kuaminika ili kutathmini ukweli wa habari.",
    "about.utility3Title": "Hukumu wazi",
    "about.utility3Text":
      "Pata jibu la Ndiyo au Hapana pamoja na kiwango cha uaminifu ili kufanya uamuzi sahihi.",
    "about.creatorTitle": "Muundaji",
    "about.creatorRole": "Msanidi programu na mtafiti",
    "about.creatorBio":
      "CHUNGUZA iliundwa kuimarisha ustahimilivu wa habari Kaskazini mwa Kivu, ikiwasaidia raia na wadau wa ndani dhidi ya habari za uongo.",
    "about.footer": "CHUNGUZA, ukaguzi wa ukweli kwa Kaskazini mwa Kivu",
    "about.phone": "Simu",
    "about.email": "Barua pepe",
    "about.github": "GitHub",
    "about.linkedin": "LinkedIn",
    "fact.yes": "Ndiyo",
    "fact.no": "Hapana",
    "fact.uncertain": "Haijulikani",
    "fact.confidence": "Uaminifu",
    "common.cancel": "Ghairi",
    "common.close": "Funga",
    "common.loading": "Inapakia...",
  },

  ln: {
    "nav.newCheck": "Koyekola sika",
    "nav.search": "Luka",
    "nav.about": "Likambo",
    "nav.myChecks": "Biyekoli na ngai",
    "nav.noChecks": "Biyekoli moko te ebombami",
    "nav.noResults": "Eloko moko te mpo na \"{query}\"",
    "nav.apiKey": "Fungola API",
    "nav.apiKeyDesc":
      "Kotisa fungola na yo ya API mpo na kolakisa makambo ya likolo.",
    "nav.save": "Kobomba",
    "nav.localContext": "Makambo ya esika",
    "nav.localContextText":
      "Tala ntango nyonso na radio ya communauté, ONG mpe batatoli liboso ya kobimisa sango.",
    "nav.searchPlaceholder": "Luka boyekoli...",
    "nav.deleteCheck": "Longola",
    "nav.deleteConfirm": "Longola vérification oyo na historique?",
    "header.searchPlaceholder": "Luka...",
    "header.notifications": "Basango",
    "header.about": "Likambo",
    "header.language": "Lokota",
    "chat.greeting": "Mbote, {name}",
    "chat.subtitle": "Mokambi ya koyekola makambo ya solo",
    "chat.tagline":
      "Yekola libondeli, nsango to mokanda na mwa miniti moke",
    "chat.placeholder":
      "Tuna motuna to kolimbola sango oyo osengeli koyekola...",
    "chat.placeholderWithFile":
      "Limbola oyo olingi koyekola na mokanda oyo...",
    "chat.attach": "Kobakisa mokanda",
    "chat.send": "Tinda",
    "chat.copy": "Kokoma",
    "chat.regenerate": "Kozongisa lisusu",
    "chat.noResponse": "Eyano moko te euti",
    "chat.error": "Libunga esalemi. Meka lisusu.",
    "chat.fileFormats": "Bafomate oyo ebandi: JPG, PNG, PDF",
    "chat.fileAttached": "Mokanda ebakisami",
    "chat.sources": "Mikanda",
    "chat.evidence": "Bapreuve",
    "chat.reliability": "Kotya motema",
    "chat.proofs": "Bapreuve ya lisusu",
    "auth.login": "Kokota",
    "auth.register": "Kokoma compte",
    "auth.email": "Adresse e-mail",
    "auth.password": "Mot de passe",
    "auth.name": "Kombo mobimba",
    "auth.confirmPassword": "Kondimisa mot de passe",
    "auth.submitLogin": "Kokota",
    "auth.submitRegister": "Kokoma compte",
    "auth.remember": "Kobosana ngai te",
    "auth.noAccount": "Compte moko te?",
    "auth.hasAccount": "Compte ezali na yo?",
    "auth.loginSubtitle":
      "Kota mpo na kozwa biyekoli na yo oyo ebombami",
    "auth.registerSubtitle":
      "Sala compte mpo na kobomba biyekoli na yo",
    "auth.logout": "Kobima",
    "auth.savedChecks": "Biyekoli oyo ebombami",
    "auth.loginError": "Ba identifiants ya malamu te",
    "auth.registerError": "Libunga na ntango ya kokoma compte",
    "about.title": "Likambo na CHUNGUZA",
    "about.back": "Kozonga",
    "about.whyTitle": "Mpo na nini CHUNGUZA?",
    "about.whyP1":
      "Na Nord-Kivu, ba rumeurs ezali kozala noki (WhatsApp, radio, monoko na monoko) na esika ya bitumba oyo sango ya lokuta ekoki kobetela bato to kobakisa stress.",
    "about.whyP2":
      "CHUNGUZA esalisaka bato, bajournalistes ya communauté mpe bato ya humanitaire koyekola noki libondeli, nsango to mokanda (image / PDF), na kotalela mikanda ya solo mpe kolakisa verdict ya polele: Ee to Te, na niveau ya confiance.",
    "about.utilityTitle": "Ndenge CHUNGUZA esalisaka yo",
    "about.utility1Title": "Koyekola noki",
    "about.utility1Text":
      "Tinda libondeli, nsango ya WhatsApp to mokanda mpe zwa verdict na mwa miniti moke.",
    "about.utility2Title": "Mikanda ya solo",
    "about.utility2Text":
      "CHUNGUZA etaleli mikanda mingi ya solo mpo na koyeba sango ezali solo to te.",
    "about.utility3Title": "Verdict ya polele",
    "about.utility3Text":
      "Zwa eyano Ee to Te na niveau ya confiance mpo na kosala likambo ya malamu.",
    "about.creatorTitle": "Mosaleli",
    "about.creatorRole": "Mobongisi programme mpe moyekoli",
    "about.creatorBio":
      "CHUNGUZA esalemi mpo na kofungola bato na Nord-Kivu libela ya sango ya lokuta, na kosalisa bato mpe bato ya esika.",
    "about.footer": "CHUNGUZA, koyekola makambo ya solo mpo na Nord-Kivu",
    "about.phone": "Telefone",
    "about.email": "E-mail",
    "about.github": "GitHub",
    "about.linkedin": "LinkedIn",
    "fact.yes": "Ee",
    "fact.no": "Te",
    "fact.uncertain": "Ezali te na ntembe",
    "fact.confidence": "Confiance",
    "common.cancel": "Kolongola",
    "common.close": "Kokanga",
    "common.loading": "Ezali kozala...",
  },

  lua: {
    "nav.newCheck": "Dikuenza dikapita",
    "nav.search": "Kukumbaja",
    "nav.about": "Makanda",
    "nav.myChecks": "Dikuenza dianyi",
    "nav.noChecks": "Dikuenza moko diidikididi",
    "nav.noResults": "Mukanda moko mu \"{query}\"",
    "nav.apiKey": "Kifungu kya API",
    "nav.apiKeyDesc":
      "Bika kifungu kyobe kya API kudi mukaji mukole.",
    "nav.save": "Kubika",
    "nav.localContext": "Mukaji wa muaba",
    "nav.localContextText":
      "Tangila ne radio ya bantu, ONG ne bantu ba mukaji kabidi udi mukaji wa nsangu.",
    "nav.searchPlaceholder": "Kukumbaja dikuenza...",
    "nav.deleteCheck": "Futa",
    "nav.deleteConfirm": "Futa verification eyi mu historique?",
    "header.searchPlaceholder": "Kukumbaja...",
    "header.notifications": "Bintu bia nsangu",
    "header.about": "Makanda",
    "header.language": "Ludimi",
    "chat.greeting": "Mbote, {name}",
    "chat.subtitle": "Mukaji wa kukapita makanda",
    "chat.tagline":
      "Kapita nsangu, bubuja to mukanda mu masekondi make",
    "chat.placeholder":
      "Bua bujila to lomba nsangu udi ukapita...",
    "chat.placeholderWithFile":
      "Lomba udi ukapita mu mukanda eu...",
    "chat.attach": "Bika mukanda",
    "chat.send": "Tuma",
    "chat.copy": "Kukopa",
    "chat.regenerate": "Buela diambu",
    "chat.noResponse": "Dijibu moko mu",
    "chat.error": "Mukanda mukole. Leta diambu.",
    "chat.fileFormats": "Mifomate miambuludidi: JPG, PNG, PDF",
    "chat.fileAttached": "Mukanda mubikidi",
    "chat.sources": "Mikanda",
    "chat.evidence": "Bintu bia kukapita",
    "chat.reliability": "Kutula mu mutima",
    "chat.proofs": "Bintu bia kukapita bia mukaji",
    "auth.login": "Kukota",
    "auth.register": "Kujila compte",
    "auth.email": "Adresse e-mail",
    "auth.password": "Mot de passe",
    "auth.name": "Dina dia mvimba",
    "auth.confirmPassword": "Kukonfirmesha mot de passe",
    "auth.submitLogin": "Kukota",
    "auth.submitRegister": "Kujila compte",
    "auth.remember": "Kundikila nganyi",
    "auth.noAccount": "Compte moko mu?",
    "auth.hasAccount": "Compte udi mu?",
    "auth.loginSubtitle":
      "Kota kudi mukaji wa dikuenza diobe diidikidi",
    "auth.registerSubtitle":
      "Sala compte kudi mukaji wa kuidika dikuenza",
    "auth.logout": "Kubuela",
    "auth.savedChecks": "Dikuenza diidikidi",
    "auth.loginError": "Ba identifiants mabi",
    "auth.registerError": "Mukanda mu kujila compte",
    "about.title": "Makanda a CHUNGUZA",
    "about.back": "Kubuela",
    "about.whyTitle": "Bua tshintu CHUNGUZA?",
    "about.whyP1":
      "Mu Nord-Kivu, nsangu zia bubuja zidi ne mukaji (WhatsApp, radio, mu kanwa) mu mukaji wa bitumba udi nsangu ya mabi ikoki kufwa bantu to kuleta stress.",
    "about.whyP2":
      "CHUNGUZA esambula bantu, bajournalistes ne bantu ba humanitaire kukapita nsangu, bubuja to mukanda (image / PDF) ne mukaji, ne mikanda ya solo ne kuleta diambu: Ee to Te, ne niveau ya confiance.",
    "about.utilityTitle": "Ndenge CHUNGUZA esambula",
    "about.utility1Title": "Kukapita ne mukaji",
    "about.utility1Text":
      "Tuma nsangu, bubuja ya WhatsApp to mukanda ne kupata diambu mu masekondi make.",
    "about.utility2Title": "Mikanda ya solo",
    "about.utility2Text":
      "CHUNGUZA etangila mikanda mingi ya solo kudi mukaji wa kukapita nsangu.",
    "about.utility3Title": "Diambu dia polele",
    "about.utility3Text":
      "Pata dijibu Ee to Te ne niveau ya confiance kudi mukaji wa kusalisa.",
    "about.creatorTitle": "Musalisi",
    "about.creatorRole": "Mobongisi programme ne moyekoli",
    "about.creatorBio":
      "CHUNGUZA esalemi kuleta bantu mu Nord-Kivu makanda ya nsangu ya solo, ne kusambula bantu ne bantu ba muaba.",
    "about.footer": "CHUNGUZA, kukapita makanda mpo na Nord-Kivu",
    "about.phone": "Telefone",
    "about.email": "E-mail",
    "about.github": "GitHub",
    "about.linkedin": "LinkedIn",
    "fact.yes": "Ee",
    "fact.no": "Te",
    "fact.uncertain": "Tudi tujue te",
    "fact.confidence": "Confiance",
    "common.cancel": "Kulekela",
    "common.close": "Kufunga",
    "common.loading": "Tudi tujidika...",
  },

  kg: {
    "nav.newCheck": "Kuyekola kuyaka",
    "nav.search": "Luka",
    "nav.about": "Mambu ya nsiku",
    "nav.myChecks": "Biyekoli na mono",
    "nav.noChecks": "Biyekoli moko ve mabikama",
    "nav.apiKey": "Fungu ya API",
    "nav.apiKeyDesc":
      "Sonika fungu na nge ya API sambu na kufwaka makambo ya nkaka.",
    "nav.save": "Bika",
    "nav.localContext": "Mambu ya esika",
    "nav.localContextText":
      "Tala ntangu nyonso na radio ya bantu, ONG mpe bantu oyo babondi liboso ya kubimisa nsangu.",
    "nav.noResults": "Eloko moko ve mpo na \"{query}\"",
    "nav.searchPlaceholder": "Luka boyekoli...",
    "nav.deleteCheck": "Katula",
    "nav.deleteConfirm": "Katula vérification yai na historique?",
    "header.searchPlaceholder": "Luka...",
    "header.notifications": "Basango",
    "header.about": "Mambu ya nsiku",
    "header.language": "Lokota",
    "chat.greeting": "Mbote, {name}",
    "chat.subtitle": "Mokambi ya kuyekola makambo ya solo",
    "chat.tagline":
      "Yekola libondeli, nsangu to mokanda na mwa miniti moke",
    "chat.placeholder":
      "Bua motuna to kolimbola nsangu oyo osengeli kuyekola...",
    "chat.placeholderWithFile":
      "Limbola oyo olingi kuyekola na mokanda yai...",
    "chat.attach": "Bakisa mokanda",
    "chat.send": "Tinda",
    "chat.copy": "Koma",
    "chat.regenerate": "Zongisa lisusu",
    "chat.noResponse": "Eyano moko ve euti",
    "chat.error": "Libunga esalemi. Meka lisusu.",
    "chat.fileFormats": "Bafomate oyo ebandi: JPG, PNG, PDF",
    "chat.fileAttached": "Mokanda ebakisami",
    "chat.sources": "Mikanda",
    "chat.evidence": "Bapreuve",
    "chat.reliability": "Kutya motema",
    "chat.proofs": "Bapreuve ya nkaka",
    "auth.login": "Kota",
    "auth.register": "Koma compte",
    "auth.email": "Adresse e-mail",
    "auth.password": "Mot de passe",
    "auth.name": "Kombo mobimba",
    "auth.confirmPassword": "Kondimisa mot de passe",
    "auth.submitLogin": "Kota",
    "auth.submitRegister": "Koma compte",
    "auth.remember": "Kobosana mono ve",
    "auth.noAccount": "Compte moko ve?",
    "auth.hasAccount": "Compte ezali na nge?",
    "auth.loginSubtitle":
      "Kota sambu na kozwa biyekoli na nge oyo mabikama",
    "auth.registerSubtitle":
      "Sala compte sambu na kobika biyekoli na nge",
    "auth.logout": "Bima",
    "auth.savedChecks": "Biyekoli oyo mabikama",
    "auth.loginError": "Ba identifiants ya malamu ve",
    "auth.registerError": "Libunga na ntango ya koma compte",
    "about.title": "Mambu ya nsiku ya CHUNGUZA",
    "about.back": "Zonga",
    "about.whyTitle": "Mpo na nini CHUNGUZA?",
    "about.whyP1":
      "Na Nord-Kivu, ba rumeurs ezali kozala noki (WhatsApp, radio, monoko na monoko) na esika ya bitumba oyo nsangu ya lokuta ekoki kobetela bantu to kobakisa stress.",
    "about.whyP2":
      "CHUNGUZA esalisaka bantu, bajournalistes mpe bato ya humanitaire kuyekola noki libondeli, nsangu to mokanda (image / PDF), na kotalela mikanda ya solo mpe kolakisa verdict ya polele: Ee to Te, na niveau ya confiance.",
    "about.utilityTitle": "Ndenge CHUNGUZA esalisaka nge",
    "about.utility1Title": "Kuyekola noki",
    "about.utility1Text":
      "Tinda libondeli, nsangu ya WhatsApp to mokanda mpe zwa verdict na mwa minuti moke.",
    "about.utility2Title": "Mikanda ya solo",
    "about.utility2Text":
      "CHUNGUZA etaleli mikanda mingi ya solo mpo na koyeba nsangu ezali solo to ve.",
    "about.utility3Title": "Verdict ya polele",
    "about.utility3Text":
      "Zwa eyano Ee to Te na niveau ya confiance mpo na kosala likambo ya malamu.",
    "about.creatorTitle": "Mosaleli",
    "about.creatorRole": "Mobongisi programme mpe moyekoli",
    "about.creatorBio":
      "CHUNGUZA esalemi sambu na kofungola bantu na Nord-Kivu libela ya nsangu ya lokuta, na kosalisa bantu mpe bato ya esika.",
    "about.footer": "CHUNGUZA, kuyekola makambo ya solo mpo na Nord-Kivu",
    "about.phone": "Telefone",
    "about.email": "E-mail",
    "about.github": "GitHub",
    "about.linkedin": "LinkedIn",
    "fact.yes": "Ee",
    "fact.no": "Te",
    "fact.uncertain": "Tudi tujue ve",
    "fact.confidence": "Confiance",
    "common.cancel": "Longola",
    "common.close": "Funga",
    "common.loading": "Ezali kozala...",
  },

  rw: {
    "nav.newCheck": "Gusuzuma gushya",
    "nav.search": "Shakisha",
    "nav.about": "Ibyerekeye",
    "nav.myChecks": "Ibyo nasuzumye",
    "nav.noChecks": "Nta gusuzuma cyabitswe",
    "nav.noResults": "Nta bisubizo bya \"{query}\"",
    "nav.apiKey": "Urufunguzo rwa API",
    "nav.apiKeyDesc":
      "Andika urufunguzo rwawe rwa API kugira ngo ukoreshe ibikorwa byinshi.",
    "nav.save": "Bika",
    "nav.localContext": "Imiterere y'aho",
    "nav.localContextText":
      "Banza usuzume n'iradiyo y'abaturage, imiryango itari iya leta n'abahamya mbere yo gusakaza amakuru.",
    "nav.searchPlaceholder": "Shakisha gusuzuma...",
    "nav.deleteCheck": "Siba",
    "nav.deleteConfirm": "Siba iki kugenzura mu mateka?",
    "header.searchPlaceholder": "Shakisha...",
    "header.notifications": "Amakuru",
    "header.about": "Ibyerekeye",
    "header.language": "Ururimi",
    "chat.greeting": "Muraho, {name}",
    "chat.subtitle": "Umufasha wo gusuzuma ukuri",
    "chat.tagline":
      "Suzuma amakuru y'ibinyoma, ubutumwa cyangwa inyandiko mu masegonda make",
    "chat.placeholder":
      "Baza ikibazo cyangwa sobanura amakuru ushaka gusuzuma...",
    "chat.placeholderWithFile":
      "Sobanura icyo ushaka gusuzuma muri iyi nyandiko...",
    "chat.attach": "Ongeraho inyandiko",
    "chat.send": "Ohereza",
    "chat.copy": "Koporora",
    "chat.regenerate": "Ongera ukore",
    "chat.noResponse": "Nta gisubizo cyabonetse",
    "chat.error": "Habaye ikosa. Ongera ugerageze.",
    "chat.fileFormats": "Ubwoko bwemewe: JPG, PNG, PDF",
    "chat.fileAttached": "Inyandiko yashyizweho",
    "chat.sources": "Inkomoko",
    "chat.evidence": "Ibyemezo",
    "chat.reliability": "Ukwizera",
    "chat.proofs": "Ibyemezo byinshi",
    "auth.login": "Injira",
    "auth.register": "Iyandikishe",
    "auth.email": "Imeyili",
    "auth.password": "Ijambo ry'ibanga",
    "auth.name": "Amazina yuzuye",
    "auth.confirmPassword": "Emeza ijambo ry'ibanga",
    "auth.submitLogin": "Injira",
    "auth.submitRegister": "Iyandikishe",
    "auth.remember": "Unyibuke",
    "auth.noAccount": "Nta konti ufite?",
    "auth.hasAccount": "Usanzwe ufite konti?",
    "auth.loginSubtitle":
      "Injira kugira ngo ubone ibyo wasuzumye wabitse",
    "auth.registerSubtitle":
      "Fungura konti kugira ngo ubike ibyo usuzuma",
    "auth.logout": "Sohoka",
    "auth.savedChecks": "Ibyo wasuzumye wabitse",
    "auth.loginError": "Amakuru yo kwinjira si yo",
    "auth.registerError": "Ikosa mu gihe cyo kwiyandikisha",
    "about.title": "Ibyerekeye CHUNGUZA",
    "about.back": "Subira inyuma",
    "about.whyTitle": "Kuki CHUNGUZA?",
    "about.whyP1":
      "Mu Majyaruguru ya Kivu, amakuru y'ibinyoma arasakara vuba (WhatsApp, radiyo, mu kanwa) mu gihe cy'imirimo y' intambara aho amakuru atari yo ashobora guteza akaga cyangwa kongera umwuka mubi.",
    "about.whyP2":
      "CHUNGUZA ifasha abaturage, abanyamakuru b' abaturage n'abakozi b' iby' ubufasha gusuzuma vuba igitekerezo, ubutumwa cyangwa inyandiko (ifoto / PDF), ihinduranya inkomoko zizwi kandi igaragaza icyemezo gisobanutse: Yego cyangwa Oya, hamwe n' urwego rw' ukwizera.",
    "about.utilityTitle": "Uko CHUNGUZA igufasha",
    "about.utility1Title": "Gusuzuma vuba",
    "about.utility1Text":
      "Ohereza igitekerezo, ubutumwa bwa WhatsApp cyangwa inyandiko ubone icyemezo mu masegonda make.",
    "about.utility2Title": "Inkomoko zizwi",
    "about.utility2Text":
      "CHUNGUZA ihinduranya inkomoko nyinshi zizwi kugira ngo isuzume ukuri kw' amakuru.",
    "about.utility3Title": "Icyemezo gisobanutse",
    "about.utility3Text":
      "Bona igisubizo cya Yego cyangwa Oya hamwe n' urwego rw' ukwizera kugira ngo ufate icyemezo cyiza.",
    "about.creatorTitle": "Uwaremye",
    "about.creatorRole": "Umuhanga wa porogaramu n' umushakashatsi",
    "about.creatorBio":
      "CHUNGUZA yashyizweho kugira ngo ikomeze ubudahangarwa bw' amakuru mu Majyaruguru ya Kivu, ishyigikira abaturage n' abakozi b' ahantu.",
    "about.footer": "CHUNGUZA, gusuzuma ukuri mu Majyaruguru ya Kivu",
    "about.phone": "Telefone",
    "about.email": "Imeyili",
    "about.github": "GitHub",
    "about.linkedin": "LinkedIn",
    "fact.yes": "Yego",
    "fact.no": "Oya",
    "fact.uncertain": "Ntibizwi neza",
    "fact.confidence": "Ukwizera",
    "common.cancel": "Hagarika",
    "common.close": "Funga",
    "common.loading": "Birimo gupakira...",
  },

  nnb: {
    "nav.newCheck": "Okushengera okuhya",
    "nav.search": "Shengera",
    "nav.about": "Eby' okumanya",
    "nav.myChecks": "Ebyo nshengera",
    "nav.noChecks": "Tihariho ebyo nshengera ebibikiddwa",
    "nav.noResults": "Tihariho ebyo byasangiddwa ku \"{query}\"",
    "nav.apiKey": "Ekikondo kya API",
    "nav.apiKeyDesc":
      "Shira ekikondo kyawe kya API okusobola okukozesa ebintu ebirungi.",
    "nav.save": "Bika",
    "nav.localContext": "Embeera y' aha",
    "nav.localContextText":
      "Sooka okakasanyize ne redio y' abantu, ONG n' abahamya okutyo otandika okusasaanya amakuru.",
    "nav.searchPlaceholder": "Shengera okushengera...",
    "nav.deleteCheck": "Siba",
    "nav.deleteConfirm": "Siba eki kugenzura?",
    "header.searchPlaceholder": "Shengera...",
    "header.notifications": "Amakuru",
    "header.about": "Eby' okumanya",
    "header.language": "Orulimi",
    "chat.greeting": "Oraire ota, {name}",
    "chat.subtitle": "Omukozi w' okukakasa amakuru",
    "chat.tagline":
      "Kakasa amakuru, obubaka oba ekiwandiiko mu masegonda make",
    "chat.placeholder":
      "Baza ekibuuzo oba sobola amakuru ogenda okukakasa...",
    "chat.placeholderWithFile":
      "Sobola eky' ogenda okukakasa mu kiwandiiko kino...",
    "chat.attach": "Shira ekiwandiiko",
    "chat.send": "Tuma",
    "chat.copy": "Koppa",
    "chat.regenerate": "Komawo okukola",
    "chat.noResponse": "Tihariho eky' okuddamu",
    "chat.error": "Wabaho ensobi. Gezaako nate.",
    "chat.fileFormats": "Enfomu ezikkirizibwa: JPG, PNG, PDF",
    "chat.fileAttached": "Ekiwandiiko kishiziddwaho",
    "chat.sources": "Ensibuko",
    "chat.evidence": "Obujulizi",
    "chat.reliability": "Obwesige",
    "chat.proofs": "Obujulizi obulala",
    "auth.login": "Yingira",
    "auth.register": "Wandiika",
    "auth.email": "Imeyili",
    "auth.password": "Ekigambo ky' ekyama",
    "auth.name": "Amannya gona",
    "auth.confirmPassword": "Kakasa ekigambo ky' ekyama",
    "auth.submitLogin": "Yingira",
    "auth.submitRegister": "Wandiika",
    "auth.remember": "Nzijukire",
    "auth.noAccount": "Tolina akaunti?",
    "auth.hasAccount": "Olina dda akaunti?",
    "auth.loginSubtitle":
      "Yingira okufuna ebyo okushengera ebibikiddwa",
    "auth.registerSubtitle":
      "Kola akaunti okubika ebyo okushengera",
    "auth.logout": "Fuma",
    "auth.savedChecks": "Ebyo okushengera ebibikiddwa",
    "auth.loginError": "Amakuru g' okuyingira si matuufu",
    "auth.registerError": "Ensobi mu kuwandiika",
    "about.title": "Eby' okumanya CHUNGUZA",
    "about.back": "Komawo",
    "about.whyTitle": "Lwaki CHUNGUZA?",
    "about.whyP1":
      "Mu Nord-Kivu, amakuru g' obubaka gasasana mangu (WhatsApp, redio, mu kamwa) mu mbeera y' entalo aho amakuru ag' obulimba gasobola okuteeka obulamu mu kabi oba okwongera obutabanguko.",
    "about.whyP2":
      "CHUNGUZA eyamba abantu, bannamakuru b' abantu n' abakozi b' obuyambi okukakasa mangu ekigambo, obubaka oba ekiwandiiko (ifoto / PDF), ng' egattanya ensibuko ez' obwesige n' okulaga eky' okusalawo: Ego oba Te, n' omutindo gw' obwesige.",
    "about.utilityTitle": "Engeri CHUNGUZA gy' ekuyamba",
    "about.utility1Title": "Okukakasa mangu",
    "about.utility1Text":
      "Tuma ekigambo, obubaka bwa WhatsApp oba ekiwandiiko ofune eky' okusalawo mu masegonda make.",
    "about.utility2Title": "Ensibuko ez' obwesige",
    "about.utility2Text":
      "CHUNGUZA egattanya ensibuko ennyingi ez' obwesige okukakasa obw' amakuru.",
    "about.utility3Title": "Eky' okusalawo ekirambika",
    "about.utility3Text":
      "Funa eky' okuddamu Ego oba Te n' omutindo gw' obwesige okusalawo obulungi.",
    "about.creatorTitle": "Omukozi",
    "about.creatorRole": "Omukozi w' puloguramu n' omunoonyereza",
    "about.creatorBio":
      "CHUNGUZA yakolebwa okunyweza abantu ba Nord-Kivu ku makuru ag' obulimba, ng' eyamba abantu n' abakozi b' aha.",
    "about.footer": "CHUNGUZA, okukakasa amakuru mu Nord-Kivu",
    "about.phone": "Essimu",
    "about.email": "Imeyili",
    "about.github": "GitHub",
    "about.linkedin": "LinkedIn",
    "fact.yes": "Ego",
    "fact.no": "Te",
    "fact.uncertain": "Tikimanyiddwa bulungi",
    "fact.confidence": "Obwesige",
    "common.cancel": "Sazaamu",
    "common.close": "Ggalawo",
    "common.loading": "Biri mu kutegeka...",
  },

  huu: {
    "nav.newCheck": "Okushengera okuhya",
    "nav.search": "Shengera",
    "nav.about": "Eby' okumanya",
    "nav.myChecks": "Ebyo nshengera",
    "nav.noChecks": "Tihariho ebyo nshengera ebibikiddwa",
    "nav.noResults": "Tihariho ebyo byasangiddwa ku \"{query}\"",
    "nav.apiKey": "Ekikondo kya API",
    "nav.apiKeyDesc":
      "Shira ekikondo kyawe kya API okukozesa ebintu ebirungi.",
    "nav.save": "Bika",
    "nav.localContext": "Embeera y' aha",
    "nav.localContextText":
      "Sooka okakasanyize ne redio y' abantu, ONG n' abahamya okutyo otandika okusasaanya amakuru.",
    "nav.searchPlaceholder": "Shengera okushengera...",
    "nav.deleteCheck": "Siba",
    "nav.deleteConfirm": "Siba eki kugenzura?",
    "header.searchPlaceholder": "Shengera...",
    "header.notifications": "Amakuru",
    "header.about": "Eby' okumanya",
    "header.language": "Orulimi",
    "chat.greeting": "Oraire ota, {name}",
    "chat.subtitle": "Omukozi w' okukakasa amakuru",
    "chat.tagline":
      "Kakasa amakuru, obubaka oba ekiwandiiko mu masegonda make",
    "chat.placeholder":
      "Baza ekibuuzo oba sobola amakuru ogenda okukakasa...",
    "chat.placeholderWithFile":
      "Sobola eky' ogenda okukakasa mu kiwandiiko kino...",
    "chat.attach": "Shira ekiwandiiko",
    "chat.send": "Tuma",
    "chat.copy": "Koppa",
    "chat.regenerate": "Komawo okukola",
    "chat.noResponse": "Tihariho eky' okuddamu",
    "chat.error": "Wabaho ensobi. Gezaako nate.",
    "chat.fileFormats": "Enfomu ezikkirizibwa: JPG, PNG, PDF",
    "chat.fileAttached": "Ekiwandiiko kishiziddwaho",
    "chat.sources": "Ensibuko",
    "chat.evidence": "Obujulizi",
    "chat.reliability": "Obwesige",
    "chat.proofs": "Obujulizi obulala",
    "auth.login": "Yingira",
    "auth.register": "Wandiika",
    "auth.email": "Imeyili",
    "auth.password": "Ekigambo ky' ekyama",
    "auth.name": "Amannya gona",
    "auth.confirmPassword": "Kakasa ekigambo ky' ekyama",
    "auth.submitLogin": "Yingira",
    "auth.submitRegister": "Wandiika",
    "auth.remember": "Nzijukire",
    "auth.noAccount": "Tolina akaunti?",
    "auth.hasAccount": "Olina dda akaunti?",
    "auth.loginSubtitle":
      "Yingira okufuna ebyo okushengera ebibikiddwa",
    "auth.registerSubtitle":
      "Kola akaunti okubika ebyo okushengera",
    "auth.logout": "Fuma",
    "auth.savedChecks": "Ebyo okushengera ebibikiddwa",
    "auth.loginError": "Amakuru g' okuyingira si matuufu",
    "auth.registerError": "Ensobi mu kuwandiika",
    "about.title": "Eby' okumanya CHUNGUZA",
    "about.back": "Komawo",
    "about.whyTitle": "Lwaki CHUNGUZA?",
    "about.whyP1":
      "Mu Nord-Kivu, amakuru g' obubaka gasasana mangu (WhatsApp, redio, mu kamwa) mu mbeera y' entalo aho amakuru ag' obulimba gasobola okuteeka obulamu mu kabi oba okwongera obutabanguko.",
    "about.whyP2":
      "CHUNGUZA eyamba abantu, bannamakuru b' abantu n' abakozi b' obuyambi okukakasa mangu ekigambo, obubaka oba ekiwandiiko (ifoto / PDF), ng' egattanya ensibuko ez' obwesige n' okulaga eky' okusalawo: Ego oba Te, n' omutindo gw' obwesige.",
    "about.utilityTitle": "Engeri CHUNGUZA gy' ekuyamba",
    "about.utility1Title": "Okukakasa mangu",
    "about.utility1Text":
      "Tuma ekigambo, obubaka bwa WhatsApp oba ekiwandiiko ofune eky' okusalawo mu masegonda make.",
    "about.utility2Title": "Ensibuko ez' obwesige",
    "about.utility2Text":
      "CHUNGUZA egattanya ensibuko ennyingi ez' obwesige okukakasa obw' amakuru.",
    "about.utility3Title": "Eky' okusalawo ekirambika",
    "about.utility3Text":
      "Funa eky' okuddamu Ego oba Te n' omutindo gw' obwesige okusalawo obulungi.",
    "about.creatorTitle": "Omukozi",
    "about.creatorRole": "Omukozi w' puloguramu n' omunoonyereza",
    "about.creatorBio":
      "CHUNGUZA yakolebwa okunyweza abantu ba Nord-Kivu ku makuru ag' obulimba, ng' eyamba abantu n' abakozi b' aha.",
    "about.footer": "CHUNGUZA, okukakasa amakuru mu Nord-Kivu",
    "about.phone": "Essimu",
    "about.email": "Imeyili",
    "about.github": "GitHub",
    "about.linkedin": "LinkedIn",
    "fact.yes": "Ego",
    "fact.no": "Te",
    "fact.uncertain": "Tikimanyiddwa bulungi",
    "fact.confidence": "Obwesige",
    "common.cancel": "Sazaamu",
    "common.close": "Ggalawo",
    "common.loading": "Biri mu kutegeka...",
  },

  shr: {
    "nav.newCheck": "Kushengera kuhya",
    "nav.search": "Luka",
    "nav.about": "Makanda",
    "nav.myChecks": "Byo nshengera",
    "nav.noChecks": "Tihariho byo nshengera bibikiddwa",
    "nav.noResults": "Tihariho byo byasangiddwa ku \"{query}\"",
    "nav.apiKey": "Ekikondo kya API",
    "nav.apiKeyDesc":
      "Shira ekikondo kyawe kya API okukozesa ebintu ebirungi.",
    "nav.save": "Bika",
    "nav.localContext": "Embeera y' aha",
    "nav.localContextText":
      "Sooka okakasanyize ne redio y' abantu, ONG n' abahamya okutyo otandika okusasaanya amakuru.",
    "nav.searchPlaceholder": "Luka okushengera...",
    "nav.deleteCheck": "Siba",
    "nav.deleteConfirm": "Siba eki kugenzura?",
    "header.searchPlaceholder": "Luka...",
    "header.notifications": "Amakuru",
    "header.about": "Makanda",
    "header.language": "Orulimi",
    "chat.greeting": "Mbote, {name}",
    "chat.subtitle": "Mukozi w' okukakasa amakuru",
    "chat.tagline":
      "Kakasa amakuru, obubaka oba ekiwandiiko mu masegonda make",
    "chat.placeholder":
      "Baza ekibuuzo oba sobola amakuru ogenda okukakasa...",
    "chat.placeholderWithFile":
      "Sobola eky' ogenda okukakasa mu kiwandiiko kino...",
    "chat.attach": "Shira ekiwandiiko",
    "chat.send": "Tuma",
    "chat.copy": "Koppa",
    "chat.regenerate": "Komawo okukola",
    "chat.noResponse": "Tihariho eky' okuddamu",
    "chat.error": "Wabaho ensobi. Gezaako nate.",
    "chat.fileFormats": "Enfomu ezikkirizibwa: JPG, PNG, PDF",
    "chat.fileAttached": "Ekiwandiiko kishiziddwaho",
    "chat.sources": "Ensibuko",
    "chat.evidence": "Obujulizi",
    "chat.reliability": "Obwesige",
    "chat.proofs": "Obujulizi obulala",
    "auth.login": "Yingira",
    "auth.register": "Wandiika",
    "auth.email": "Imeyili",
    "auth.password": "Ekigambo ky' ekyama",
    "auth.name": "Amannya gona",
    "auth.confirmPassword": "Kakasa ekigambo ky' ekyama",
    "auth.submitLogin": "Yingira",
    "auth.submitRegister": "Wandiika",
    "auth.remember": "Nzijukire",
    "auth.noAccount": "Tolina akaunti?",
    "auth.hasAccount": "Olina dda akaunti?",
    "auth.loginSubtitle":
      "Yingira okufuna byo okushengera bibikiddwa",
    "auth.registerSubtitle":
      "Kola akaunti okubika byo okushengera",
    "auth.logout": "Fuma",
    "auth.savedChecks": "Byo okushengera bibikiddwa",
    "auth.loginError": "Amakuru g' okuyingira si matuufu",
    "auth.registerError": "Ensobi mu kuwandiika",
    "about.title": "Makanda a CHUNGUZA",
    "about.back": "Komawo",
    "about.whyTitle": "Lwaki CHUNGUZA?",
    "about.whyP1":
      "Mu Nord-Kivu, amakuru g' obubaka gasasana mangu (WhatsApp, redio, mu kamwa) mu mbeera y' entalo aho amakuru ag' obulimba gasobola okuteeka obulamu mu kabi oba okwongera obutabanguko.",
    "about.whyP2":
      "CHUNGUZA eyamba abantu, bannamakuru b' abantu n' abakozi b' obuyambi okukakasa mangu ekigambo, obubaka oba ekiwandiiko (ifoto / PDF), ng' egattanya ensibuko ez' obwesige n' okulaga eky' okusalawo: Ego oba Te, n' omutindo gw' obwesige.",
    "about.utilityTitle": "Engeri CHUNGUZA gy' ekuyamba",
    "about.utility1Title": "Okukakasa mangu",
    "about.utility1Text":
      "Tuma ekigambo, obubaka bwa WhatsApp oba ekiwandiiko ofune eky' okusalawo mu masegonda make.",
    "about.utility2Title": "Ensibuko ez' obwesige",
    "about.utility2Text":
      "CHUNGUZA egattanya ensibuko ennyingi ez' obwesige okukakasa obw' amakuru.",
    "about.utility3Title": "Eky' okusalawo ekirambika",
    "about.utility3Text":
      "Funa eky' okuddamu Ego oba Te n' omutindo gw' obwesige okusalawo obulungi.",
    "about.creatorTitle": "Omukozi",
    "about.creatorRole": "Omukozi w' puloguramu n' omunoonyereza",
    "about.creatorBio":
      "CHUNGUZA yakolebwa okunyweza abantu ba Nord-Kivu ku makuru ag' obulimba, ng' eyamba abantu n' abakozi b' aha.",
    "about.footer": "CHUNGUZA, okukakasa amakuru mu Nord-Kivu",
    "about.phone": "Essimu",
    "about.email": "Imeyili",
    "about.github": "GitHub",
    "about.linkedin": "LinkedIn",
    "fact.yes": "Ego",
    "fact.no": "Te",
    "fact.uncertain": "Tikimanyiddwa bulungi",
    "fact.confidence": "Obwesige",
    "common.cancel": "Sazaamu",
    "common.close": "Ggalawo",
    "common.loading": "Biri mu kutegeka...",
  },
};

export function translate(
  locale: Locale,
  key: MessageKey,
  params?: Record<string, string | number>,
): string {
  let text = messages[locale]?.[key] ?? messages.fr[key] ?? key;
  if (params) {
    for (const [paramKey, value] of Object.entries(params)) {
      text = text.replace(new RegExp(`\\{${paramKey}\\}`, "g"), String(value));
    }
  }
  return text;
}
