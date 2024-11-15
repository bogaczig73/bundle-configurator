export const items = [
  {
    category: "UŽIVATELÉ",
    items: [
      { id: 1, name: "Počet uživatelů s plným přístupem", note: "Pojmenovaní uživatelé (ne konkurenční)" },
      { id: 2, name: "Cena za uzivatele" },
      { id: 3, name: "Read-only uživatelé", note: "pojmenovaní uživatelé, nepočítají se do celkového počtu uživatelů a nemají právo na API" },
      { id: 4, name: "Cena za read-only uzivatele" },
      { id: 5, name: "Správa uživatelů a předplatných v novém Zákaznickém portálu" },
      { id: 6, name: "API" }
    ]
  },
  {
    category: "VLASTNOSTI SYSTÉMU",
    items: [
      { id: 7, name: "Systém pro více IČO" },
      { id: 8, name: "Počet IČO v ceně" },
      { id: 9, name: "Databáze" },
      { id: 10, name: "API" }
    ]
  },
  {
    category: "MODULY (AGENDY)",
    items: [
      { id: 11, name: "Základ ERP", note: "Administrace, Definovatelné číselníky, Dokumenty a přílohy, E-maily a interní vzkazy, Evidence pošty, Nástroje přizpůsobení, Ochrana dat, Automatizační server, všechny dostupné jazykové mutace; automatické aktualizace kurzů z internetu, import dat z insolvenčního rejstříku, řízení pohledávek a automatické upomínky, importy a exporty, Adresář" },
      { id: 12, name: "Obchod a sklad", note: "Nákup, Prodej, Maloobchodní prodej, Splátkový prodej, CRM, SCM (Supply chain management), Skladové hospodářství, Polohované sklady, Kompletace, Importy dat, Servis, Dodací podmínky" },
      { id: 13, name: "Finance a účetnictví", note: "Účetnictví a výkazy, Bankovní API a homebanking, Kniha jízd, Majetek, Pokladna, Pokročilá práce s doklady, Řízení pohledávek a automatické upomínky, EET" },
      { id: 14, name: "Řízení a management", note: "Workflow (schvalovací scénáře), Reporty, Projektové řízení, Funkce pro MS Excel" },
      { id: 15, name: "Výroba", note: "Výroba, IoT" },
      { id: 16, name: "Mzdy a personalistika", note: "Mzdy a personalistika, Docházka" }
    ]
  },
  {
    category: "ADD-ONS",
    subcategories: [
      {
        name: "Obchod a sklad",
        items: [
          { id: 17, name: "EDI", note: "Elektronická výměna dat a dokladů mezi společnostmi a jejich ERP systémy" },
          { id: 18, name: "E-shop / B2B portal", note: "E-shop od ABRA Software ve standardní šabloně + stavový monitoring systému (e-mailová notifikace o běhu e-shopu a proaktivní řešení v případě blížící se chyby nebo krizového stavu) v ceně" },
          { id: 19, name: "E-shop – jazyková mutace", note: "Podpora češtiny, slovenštiny, angličtiny a němčiny." },
          { id: 20, name: "E-shop - zakázkový e-shop", note: "E-shop od ABRA Software v šabloně na míru" },
          { id: 21, name: "Expedice balíků – integrace služby Balíkobot.cz", note: "Automatická expedice balíků z vašeho systému na jeden klik." },
          { id: 22, name: "Mobilní skladník", note: "Aplikace pro správu skladového hospodářství na mobilních terminálech a zařízeních na platformě Android." },
          { id: 23, name: "Obchodní referent", note: "Webová aplikace pro práci s objednávkami." },
          { id: 24, name: "Mobilní servis", note: "Webová aplikace pro práci servisních techniků." }
        ]
      },
      {
        name: "Řízení a management, Finance a účetnictví, Controlling",
        items: [
          { id: 25, name: "ABRA BI (obsahuje standardní BI reporty)", note: "Business Intelligence pro celkový přehled o firmě." },
          { id: 26, name: "ABRA Business Navigátor – analyzer", note: "ABN je Efektivní nástroj pro finanční plánování a reporting." },
          { id: 27, name: "ABRA Business Navigátor – builder", note: "(Uživatel s možností zadávání dat.)" },
          { id: 28, name: "ABRA Business Navigátor – další spojení", note: "Chcete-li využívat ABN pro více IČO." },
          { id: 29, name: "ABRA On-line schvalování", note: "Webová aplikace umožňující schvalovat doklady z prohlížeče či z příchozího e-mailu." },
          { id: 30, name: "OCR (Optical Character Recognition)", note: "Webová aplikace pro vytěžování příchozích dokladů a jejich uložení do ABRA Gen." }
        ]
      },
      {
        name: "Výroba",
        items: [
          { id: 31, name: "Výrobní terminál (PLM)", note: "Webová aplikace pro pracovníky výroby." }
        ]
      }
    ]
  },
  {
    category: "Rozšiřující funkce",
    items: [
      { id: 32, name: "Licence katalogových doplňků", note: "Odesílání výplatních pásek e-mailem. Hromadné zpracování faktur a záloh. Hlášení EKO-KOM. Hromadná fakturace. Billing – automatické generování dokladů. Integrace na MS SharePoint" },

    ]
  },
  {
    category: "BEZPEČNOST, STABILITA A DOSTUPNOST SYSTÉMU",
    items: [
      { id: 39, name: "Vzdálený monitoring (on-premise)", note: "Vzdáleně sledujeme vytíženost serveru, funkčnost služeb atp. E-mailová notifikace při zjištění blížícího se problému nebo vzniku nebezpečném stavu (stavový monitoring)." },
      { id: 40, name: "Záložní provoz", note: "Záloha ABRA Gen v ABRA cloudu (Pro on-premise instalace)" },
      { id: 41, name: "Garantovaná reakční doba na krizovou situaci standardu systému" },
      { id: 33, name: "Garantovaná reakční doba na krizovou situaci vč. řešení zakázkových úprav" },
      { id: 42, name: "Virtuální správce ABRA Gen" },
      { id: 43, name: "Spáva databáze Oracle" },
      { id: 44, name: "Spáva databáze MS SQL" },
      { id: 45, name: "Monitoring databázového serveru Oracle" },
      { id: 46, name: "Licence pro testovací prostředí" },
      { id: 47, name: "Preventivní údržba" }
    ]
  },
  {
    category: "AKTUALIZACE SYSTÉMU",
    items: [
      { id: 48, name: "Dostupnost nové verze systému a legislativy" },
      { id: 49, name: "Aktualizace systému vč. garance stejné funkčnosti zakázkových úprav – pro ABRA online i on-prem" }
    ]
  },
  {
    category: "ZAKÁZKOVÉ ÚPRAVY A VLASTNÍ SKRIPTOVÁNÍ",
    items: [
      { id: 87, name: "Zákázkové úpravy od Abry a certifikovaných partnerů" },
      { id: 88, name: "Vlastní skriptování" }
    ]
  },
  {
    category: "ZÁKAZNICKÁ PODPORA A PÉČE",
    items: [
      { id: 50, name: "Přidělený account manager" },
      { id: 51, name: "Písemná hotline" },
      { id: 52, name: "Telefonní hotline" },
      { id: 53, name: "Přednostní odbavení na hotline" },
      { id: 54, name: "Uživatelské videokurzy" },
      { id: 55, name: "Videokurzy pro pokročilé uživatele" },
      { id: 56, name: "Strategická konzultace k využití Abry ke zlepšení byznysu", note: "ročně 4 hodiny konzultace se zápisem s konkrétními návrhy" }
    ]
  },
  {
    category: "BALÍČKY SLUŽEB",
    items: [
      { id: 57, name: "Přednostní péče", note: "Přednostní odbavení na hotline, Garantovaná reakční doba, Přednostní odbavení požadavků, Předplacené konzultační práce" },
      { id: 58, name: "Péče all-inclusive", note: "Individuálně přizpůsobený balíček služeb – např. předplacené konzultační práce, přednostní odbavení hotline i požadavků, monitoring systému, zálohování do ABRA cloudu, profylaxe" }
    ]
  },
  {
    category: "ABRA ONLINE",
    items: [
      { id: 59, name: "ABRA online", note: "Plynulý provoz systému v cloudovém prostředí s komplexní péčí a špičkovým zabezpečením." },
      { id: 60, name: "Aktualizace vč. podporovaných add-onů s výjimkou BI a WMS" },
      { id: 34, name: "Automatizační server – jedno vlákno" },
      { id: 61, name: "Provoz rozhranní pro ABRA Apps" },
      { id: 62, name: "Provoz ABRA On-line schvalování" },
      { id: 35, name: "API každých 16 vláken" },
      { id: 36, name: "Webové služby" },
      { id: 63, name: "Virtuální server Basic" },
      { id: 64, name: "Virtuální server Power" },
      { id: 65, name: "Provoz ABRA BI" },
      { id: 66, name: "Automatizační server – paralelní zpracování úloh" },
      { id: 67, name: "Využívaná data nad 10 GB", note: "fakturace dle skutečnosti" },
      { id: 68, name: "MS Office" },
      { id: 69, name: "Provoz ABRA E-shop" },
      { id: 37, name: "Provoz ABN pro zákazníky s databází Firebird" },
      { id: 38, name: "Provoz ABN pro zákazníky s databází MS SQL" },
      { id: 70, name: "2FA – dvoufaktorová autentizace za uživatele" },
      { id: 80, name: "Pohotovost 13x7x4" }
    ]
  },
  {
    category: "SLUŽBY KONZULTANTŮ",
    items: [
      { id: 71, name: "Základní hodinová sazba" },
      { id: 72, name: "Doprava" },
      { id: 73, name: "Pohotovost k servisnímu zásahu (on-line)" },
      { id: 74, name: "Pravidelný rozvoj – měsíční návštěva", note: "v případě realizace v provozovně Zákazníka je k ceně připočítáno dopravné" },
      { id: 75, name: "Pravidelný rozvoj – čtvrtletní návštěva", note: "v případě realizace v provozovně Zákazníka je k ceně připočítáno dopravné" },
      { id: 76, name: "Předplacené dny HW specialisty" },
      { id: 77, name: "Příplatek za práci mimo pracovní dobu" },
      { id: 91, name: "Příplatek za práci v noci a mimo pracovní dny" }
    ]
  },
  {
    category: "OSTATNÍ",
    items: [
      { id: 78, name: "Provoz ABN a BNS v ABRA cloudu bez služby ABRA online" },
      { id: 79, name: "Zákazníkem vytvořená aplikace v ABRA Apps", note: "Webová aplikace na míru vytvořená v prostředí ABRA Apps." },
      { id: 81, name: "ABRA Webhosting" },
      { id: 82, name: "Správa domény a Správa domény 3. řádu" }
    ]
  },
  {
    category: "DALŠÍ NABÍZENÉ SLUŽBY",
    items: [
      { id: 83, name: "Zpracování mezd (mdové účetnictví)" },
      { id: 84, name: "Účetní služby" },
      { id: 85, name: "Daňové poradenství" },
      { id: 86, name: "Ekonomické poradenství" }
    ]
  }
];

export const categories = [
  { id: 1, name: "UŽIVATELÉ", parentId: null },
  { id: 2, name: "VLASTNOSTI SYSTÉMU", parentId: null },
  { id: 3, name: "MODULY (AGENDY)", parentId: null },
  { id: 4, name: "ADD-ONS", parentId: null },
  { id: 5, name: "Obchod a sklad", parentId: 4 },
  { id: 6, name: "Řízení a management, Finance a účetnictví, Controlling", parentId: 4 },
  { id: 7, name: "Výroba", parentId: 4 },
  { id: 8, name: "Rozšiřující funkce", parentId: null },
  { id: 9, name: "BEZPEČNOST, STABILITA A DOSTUPNOST SYSTÉMU", parentId: null },
  { id: 10, name: "AKTUALIZACE SYSTÉMU", parentId: null },
  { id: 11, name: "ZAKÁZKOVÉ ÚPRAVY A VLASTNÍ SKRIPTOVÁNÍ", parentId: null },
  { id: 12, name: "ZÁKAZNICKÁ PODPORA A PÉČE", parentId: null },
  { id: 13, name: "BALÍČKY SLUŽEB", parentId: null },
  { id: 14, name: "ABRA ONLINE", parentId: null },
  { id: 15, name: "SLUŽBY KONZULTANTŮ", parentId: null },
  { id: 16, name: "OSTATNÍ", parentId: null },
  { id: 17, name: "DALŠÍ NABÍZENÉ SLUŽBY", parentId: null }
];

export const flatItems = [
  // UŽIVATELÉ
  { id: 1, name: "Počet uživatelů s plným přístupem", note: "Pojmenovaní uživatelé (ne konkurenční)", categoryId: 1 },
  { id: 2, name: "Cena za uzivatele", categoryId: 1 },
  { id: 3, name: "Read-only uživatelé", note: "pojmenovaní uživatelé, nepočítají se do celkového počtu uživatelů a nemají právo na API", categoryId: 1 },
  { id: 4, name: "Cena za read-only uzivatele", categoryId: 1 },
  { id: 5, name: "Správa uživatelů a předplatných v novém Zákaznickém portálu", categoryId: 1 },
  { id: 6, name: "API", categoryId: 1 },

  // VLASTNOSTI SYSTÉMU
  { id: 7, name: "Systém pro více IČO", categoryId: 2 },
  { id: 8, name: "Počet IČO v ceně", categoryId: 2 },
  { id: 9, name: "Databáze", categoryId: 2 },
  { id: 10, name: "API", categoryId: 2 },

  // MODULY (AGENDY)
  { id: 11, name: "Základ ERP", note: "Administrace, Definovatelné číselníky, Dokumenty a přílohy, E-maily a interní vzkazy, Evidence pošty, Nástroje přizpůsobení, Ochrana dat, Automatizační server, všechny dostupné jazykové mutace; automatické aktualizace kurzů z internetu, import dat z insolvenčního rejstříku, řízení pohledávek a automatické upomínky, importy a exporty, Adresář", categoryId: 3 },
  { id: 12, name: "Obchod a sklad", note: "Nákup, Prodej, Maloobchodní prodej, Splátkový prodej, CRM, SCM (Supply chain management), Skladové hospodářství, Polohované sklady, Kompletace, Importy dat, Servis, Dodací podmínky", categoryId: 3 },
  { id: 13, name: "Finance a účetnictví", note: "Účetnictví a výkazy, Bankovní API a homebanking, Kniha jízd, Majetek, Pokladna, Pokročilá práce s doklady, Řízení pohledávek a automatické upomínky, EET", categoryId: 3 },
  { id: 14, name: "Řízení a management", note: "Workflow (schvalovací scénáře), Reporty, Projektové řízení, Funkce pro MS Excel", categoryId: 3 },
  { id: 15, name: "Výroba", note: "Výroba, IoT", categoryId: 3 },
  { id: 16, name: "Mzdy a personalistika", note: "Mzdy a personalistika, Docházka", categoryId: 3 },

  // ADD-ONS - Obchod a sklad
  { id: 17, name: "EDI", note: "Elektronická výměna dat a dokladů mezi společnostmi a jejich ERP systémy", categoryId: 5 },
  { id: 18, name: "E-shop / B2B portal", note: "E-shop od ABRA Software ve standardní šabloně + stavový monitoring systému (e-mailová notifikace o běhu e-shopu a proaktivní řešení v případě blížící se chyby nebo krizového stavu) v ceně", categoryId: 5 },
  { id: 19, name: "E-shop – jazyková mutace", note: "Podpora češtiny, slovenštiny, angličtiny a němčiny.", categoryId: 5 },
  { id: 20, name: "E-shop - zakázkový e-shop", note: "E-shop od ABRA Software v šabloně na míru", categoryId: 5 },
  { id: 21, name: "Expedice balíků – integrace služby Balíkobot.cz", note: "Automatická expedice balíků z vašeho systému na jeden klik.", categoryId: 5 },
  { id: 22, name: "Mobilní skladník", note: "Aplikace pro správu skladového hospodářství na mobilních terminálech a zařízeních na platformě Android.", categoryId: 5 },
  { id: 23, name: "Obchodní referent", note: "Webová aplikace pro práci s objednávkami.", categoryId: 5 },
  { id: 24, name: "Mobilní servis", note: "Webová aplikace pro práci servisních techniků.", categoryId: 5 },

  // ADD-ONS - Řízení a management, Finance a účetnictví, Controlling
  { id: 25, name: "ABRA BI (obsahuje standardní BI reporty)", note: "Business Intelligence pro celkový přehled o firmě.", categoryId: 6 },
  { id: 26, name: "ABRA Business Navigátor – analyzer", note: "ABN je Efektivní nástroj pro finanční plánování a reporting.", categoryId: 6 },
  { id: 27, name: "ABRA Business Navigátor – builder", note: "(Uživatel s možností zadávání dat.)", categoryId: 6 },
  { id: 28, name: "ABRA Business Navigátor – další spojení", note: "Chcete-li využívat ABN pro více IČO.", categoryId: 6 },
  { id: 29, name: "ABRA On-line schvalování", note: "Webová aplikace umožňující schvalovat doklady z prohlížeče či z příchozího e-mailu.", categoryId: 6 },
  { id: 30, name: "OCR (Optical Character Recognition)", note: "Webová aplikace pro vytěžování příchozích dokladů a jejich uložení do ABRA Gen.", categoryId: 6 },

  // ADD-ONS - Výroba
  { id: 31, name: "Výrobní terminál (PLM)", note: "Webová aplikace pro pracovníky výroby.", categoryId: 7 },

  // Rozšiřující funkce
  { id: 32, name: "Licence katalogových doplňků", note: "Odesílání výplatních pásek e-mailem. Hromadné zpracování faktur a záloh. Hlášení EKO-KOM. Hromadná fakturace. Billing – automatické generování dokladů. Integrace na MS SharePoint", categoryId: 8 },

  // BEZPEČNOST, STABILITA A DOSTUPNOST SYSTÉMU
  { id: 39, name: "Vzdálený monitoring (on-premise)", note: "Vzdáleně sledujeme vytíženost serveru, funkčnost služeb atp. E-mailová notifikace při zjištění blížícího se problému nebo vzniku nebezpečném stavu (stavový monitoring).", categoryId: 9 },
  { id: 40, name: "Záložní provoz", note: "Záloha ABRA Gen v ABRA cloudu (Pro on-premise instalace)", categoryId: 9 },
  { id: 41, name: "Garantovaná reakční doba na krizovou situaci standardu systému", categoryId: 9 },
  { id: 33, name: "Garantovaná reakční doba na krizovou situaci vč. řešení zakázkových úprav", categoryId: 9 },
  { id: 42, name: "Virtuální správce ABRA Gen", categoryId: 9 },
  { id: 43, name: "Spáva databáze Oracle", categoryId: 9 },
  { id: 44, name: "Spáva databáze MS SQL", categoryId: 9 },
  { id: 45, name: "Monitoring databázového serveru Oracle", categoryId: 9 },
  { id: 46, name: "Licence pro testovací prostředí", categoryId: 9 },
  { id: 47, name: "Preventivní údržba", categoryId: 9 },

  // AKTUALIZACE SYSTÉMU
  { id: 48, name: "Dostupnost nové verze systému a legislativy", categoryId: 10 },
  { id: 49, name: "Aktualizace systému vč. garance stejné funkčnosti zakázkových úprav – pro ABRA online i on-prem", categoryId: 10 },

  // ZAKÁZKOVÉ ÚPRAVY A VLASTNÍ SKRIPTOVÁNÍ
  { id: 87, name: "Zákázkové úpravy od Abry a certifikovaných partnerů", categoryId: 11 },
  { id: 88, name: "Vlastní skriptování", categoryId: 11 },

  // ZÁKAZNICKÁ PODPORA A PÉČE
  { id: 50, name: "Přidělený account manager", categoryId: 12 },
  { id: 51, name: "Písemná hotline", categoryId: 12 },
  { id: 52, name: "Telefonní hotline", categoryId: 12 },
  { id: 53, name: "Přednostní odbavení na hotline", categoryId: 12 },
  { id: 54, name: "Uživatelské videokurzy", categoryId: 12 },
  { id: 55, name: "Videokurzy pro pokročilé uživatele", categoryId: 12 },
  { id: 56, name: "Strategická konzultace k využití Abry ke zlepšení byznysu", note: "ročně 4 hodiny konzultace se zápisem s konkrétními návrhy", categoryId: 12 },

  // BALÍČKY SLUŽEB
  { id: 57, name: "Přednostní péče", note: "Přednostní odbavení na hotline, Garantovaná reakční doba, Přednostní odbavení požadavků, Předplacené konzultační práce", categoryId: 13 },
  { id: 58, name: "Péče all-inclusive", note: "Individuálně přizpůsobený balíček služeb – např. předplacené konzultační práce, přednostní odbavení hotline i požadavků, monitoring systému, zálohování do ABRA cloudu, profylaxe", categoryId: 13 },

  // ABRA ONLINE
  { id: 59, name: "ABRA online", note: "Plynulý provoz systému v cloudovém prostředí s komplexní péčí a špičkovým zabezpečením.", categoryId: 14 },
  { id: 60, name: "Aktualizace vč. podporovaných add-onů s výjimkou BI a WMS", categoryId: 14 },
  { id: 34, name: "Automatizační server – jedno vlákno", categoryId: 14 },
  { id: 61, name: "Provoz rozhranní pro ABRA Apps", categoryId: 14 },
  { id: 62, name: "Provoz ABRA On-line schvalování", categoryId: 14 },
  { id: 35, name: "API každých 16 vláken", categoryId: 14 },
  { id: 36, name: "Webové služby", categoryId: 14 },
  { id: 63, name: "Virtuální server Basic", categoryId: 14 },
  { id: 64, name: "Virtuální server Power", categoryId: 14 },
  { id: 65, name: "Provoz ABRA BI", categoryId: 14 },
  { id: 66, name: "Automatizační server – paralelní zpracování úloh", categoryId: 14 },
  { id: 67, name: "Využívaná data nad 10 GB", note: "fakturace dle skutečnosti", categoryId: 14 },
  { id: 68, name: "MS Office", categoryId: 14 },
  { id: 69, name: "Provoz ABRA E-shop", categoryId: 14 },
  { id: 37, name: "Provoz ABN pro zákazníky s databází Firebird", categoryId: 14 },
  { id: 38, name: "Provoz ABN pro zákazníky s databází MS SQL", categoryId: 14 },
  { id: 70, name: "2FA – dvoufaktorová autentizace za uživatele", categoryId: 14 },
  { id: 80, name: "Pohotovost 13x7x4", categoryId: 14 },

  // SLUŽBY KONZULTANTŮ
  { id: 71, name: "Základní hodinová sazba", categoryId: 15 },
  { id: 72, name: "Doprava", categoryId: 15 },
  { id: 73, name: "Pohotovost k servisnímu zásahu (on-line)", categoryId: 15 },
  { id: 74, name: "Pravidelný rozvoj – měsíční návštěva", note: "v případě realizace v provozovně Zákazníka je k ceně připočítáno dopravné", categoryId: 15 },
  { id: 75, name: "Pravidelný rozvoj – čtvrtletní návštěva", note: "v případě realizace v provozovně Zákazníka je k ceně připočítáno dopravné", categoryId: 15 },
  { id: 76, name: "Předplacené dny HW specialisty", categoryId: 15 },
  { id: 77, name: "Příplatek za práci mimo pracovní dobu", categoryId: 15 },
  { id: 91, name: "Příplatek za práci v noci a mimo pracovní dny", categoryId: 15 },

  // OSTATNÍ
  { id: 78, name: "Provoz ABN a BNS v ABRA cloudu bez služby ABRA online", categoryId: 16 },
  { id: 79, name: "Zákazníkem vytvořená aplikace v ABRA Apps", note: "Webová aplikace na míru vytvořená v prostředí ABRA Apps.", categoryId: 16 },
  { id: 81, name: "ABRA Webhosting", categoryId: 16 },
  { id: 82, name: "Správa domény a Správa domény 3. řádu", categoryId: 16 },

  // DALŠÍ NABÍZENÉ SLUŽBY
  { id: 83, name: "Zpracování mezd (mdové účetnictví)", categoryId: 17 },
  { id: 84, name: "Účetní služby", categoryId: 17 },
  { id: 85, name: "Daňové poradenství", categoryId: 17 },
  { id: 86, name: "Ekonomické poradenství", categoryId: 17 }
];


export const items2 = [
  {
    id: 1,
    amount: 0,
    toggle: false,
    individual: false,
    name: "Počet uživatelů s plným přístupem",
    categoryId: 1,
    note: "Pojmenovaní uživatelé (ne konkurenční)",
    prices: [
      { packageId: 1, price: 5, selected: true },
      { packageId: 2, price: 20, selected: true },
      { packageId: 3, price: 9999, selected: true }
    ]
  },
  {
    id: 2,
    amount: 0,
    toggle: false,
    individual: false,
    name: "Cena za uzivatele",
    categoryId: 1,
    prices: [
      { packageId: 1, price: 1391, selected: false },
      { packageId: 2, price: 1691, selected: true },
      { packageId: 3, price: 2000, selected: true }
    ]
  },
  {
    id: 3,
    amount: 0,
    toggle: false,
    individual: false,
    name: "Read-only uživatelé",
    categoryId: 1,
    note: "pojmenovaní uživatelé, nepočítají se do celkového počtu uživatelů a nemají právo na API",
    prices: [
      { packageId: 1, price: 0, selected: false },
      { packageId: 2, price: 2, selected: true },
      { packageId: 3, price: 5, selected: true }
    ]
  },
  {
    id: 4,
    amount: 0,
    toggle: false,
    individual: false,
    name: "Cena za read-only uzivatele",
    categoryId: 1,
    prices: [
      { packageId: 1, price: 0, selected: false },
      { packageId: 2, price: 845, selected: true },
      { packageId: 3, price: 995, selected: true }
    ]
  },
  {
    id: 5,
    amount: 0,
    toggle: false,
    individual: false,
    name: "Správa uživatelů a předplatných v novém Zákaznickém portálu",
    categoryId: 1,
    prices: [
      { packageId: 1, price: 0, selected: true },
      { packageId: 2, price: 0, selected: true },
      { packageId: 3, price: 0, selected: true }
    ]
  },
  {
    id: 6,
    amount: 0,
    toggle: false,
    individual: false,
    name: "API",
    categoryId: 1,
    prices: [
      { packageId: 1, price: 0, selected: false },
      { packageId: 2, price: 1690, selected: true },
      { packageId: 3, price: 1950, selected: true }
    ]
  },
  {
    id: 7,
    amount: 0,
    toggle: false,
    individual: false,
    name: "Systém pro více IČO",
    categoryId: 2,
    prices: [
      { packageId: 1, price: 0, selected: false },
      { packageId: 2, price: 1250, selected: true },
      { packageId: 3, price: 1250, selected: true }
    ]
  },
  {
    id: 8,
    amount: 0,
    toggle: false,
    individual: false,
    name: "Počet IČO v ceně",
    categoryId: 2,
    prices: [
      { packageId: 1, price: 0, selected: false },
      { packageId: 2, price: 2, selected: true },
      { packageId: 3, price: 5, selected: true }
    ]
  },
  {
    id: 9,
    amount: 0,
    toggle: false,
    individual: false,
    name: "Databáze",
    categoryId: 2,
    prices: [
      { packageId: 1, price: 0, selected: false },
      { packageId: 2, price: 0, selected: true },
      { packageId: 3, price: 0, selected: true }
    ]
  },
  {
    id: 10,
    amount: 0,
    toggle: false,
    individual: false,
    name: "API",
    categoryId: 2,
    prices: [
      { packageId: 1, price: 0, selected: false },
      { packageId: 2, price: 0, selected: true },
      { packageId: 3, price: 0, selected: true }
    ]
  },
  {
    id: 15,
    amount: 0,
    toggle: false,
    individual: false,
    name: "Výroba",
    categoryId: 3,
    note: "Výroba, IoT",
    prices: [
      { packageId: 1, price: 0, selected: false },
      { packageId: 2, price: 200, selected: true },
      { packageId: 3, price: 0, selected: true }
    ]
  },
  {
    id: 17,
    amount: 0,
    toggle: false,
    individual: false,
    name: "EDI",
    categoryId: 5,
    note: "Elektronická výměna dat a dokladů mezi společnostmi a jejich ERP systémy",
    prices: [
      { packageId: 1, price: 0, selected: false },
      { packageId: 2, price: 2000, selected: true },
      { packageId: 3, price: 0, selected: true }
    ]
  },
  {
    id: 18,
    amount: 0,
    toggle: false,
    individual: false,
    name: "E-shop / B2B portal",
    categoryId: 5,
    note: "E-shop od ABRA Software ve standardní šabloně + stavový monitoring systému (e-mailová notifikace o běhu e-shopu a proaktivní řešení v případě blížící se chyby nebo krizového stavu) v ceně",
    prices: [
      { packageId: 1, price: 0, selected: false },
      { packageId: 2, price: 4000, selected: true },
      { packageId: 3, price: 4000, selected: true }
    ]
  },
  {
    id: 19,
    amount: 0,
    toggle: false,
    individual: false,
    name: "E-shop – jazyková mutace",
    categoryId: 5,
    note: "Podpora češtiny, slovenštiny, angličtiny a němčiny.",
    prices: [
      { packageId: 1, price: 0, selected: false },
      { packageId: 2, price: 1000, selected: true },
      { packageId: 3, price: 1000, selected: true }
    ]
  },
  {
    id: 20,
    amount: 0,
    toggle: false,
    individual: false,
    name: "E-shop - zakázkový e-shop",
    categoryId: 5,
    note: "E-shop od ABRA Software v šabloně na míru",
    prices: [
      { packageId: 1, price: 0, selected: false },
      { packageId: 2, price: 8000, selected: true },
      { packageId: 3, price: 8000, selected: true }
    ]
  },
  {
    id: 21,
    amount: 0,
    toggle: false,
    individual: false,
    name: "Expedice balíků – integrace služby Balíkobot.cz",
    categoryId: 5,
    note: "Automatická expedice balíků z vašeho systému na jeden klik.",
    prices: [
      { packageId: 1, price: 0, selected: false },
      { packageId: 2, price: 0, selected: true },
      { packageId: 3, price: 0, selected: true }
    ]
  },
  {
    id: 22,
    amount: 0,
    toggle: false,
    individual: false,
    name: "Mobilní skladník",
    categoryId: 5,
    note: "Aplikace pro správu skladového hospodářství na mobilních terminálech a zařízeních na platformě Android.",
    prices: [
      { packageId: 1, price: 0, selected: false },
      { packageId: 2, price: 1200, selected: true },
      { packageId: 3, price: 1200, selected: true }
    ]
  },
  {
    id: 23,
    amount: 0,
    toggle: false,
    individual: false,
    name: "Obchodní referent",
    categoryId: 5,
    note: "Webová aplikace pro práci s objednávkami.",
    prices: [
      { packageId: 1, price: 0, selected: false },
      { packageId: 2, price: 790, selected: true },
      { packageId: 3, price: 790, selected: true }
    ]
  },
  {
    id: 24,
    amount: 0,
    toggle: false,
    individual: false,
    name: "Mobilní servis",
    categoryId: 5,
    note: "Webová aplikace pro práci servisních techniků.",
    prices: [
      { packageId: 1, price: 0, selected: false },
      { packageId: 2, price: 990, selected: true },
      { packageId: 3, price: 990, selected: true }
    ]
  },
  {
    id: 25,
    amount: 0,
    toggle: false,
    individual: false,
    name: "ABRA BI (obsahuje standardní BI reporty)",
    categoryId: 6,
    note: "Business Intelligence pro celkový přehled o firmě.",
    prices: [
      { packageId: 1, price: 0, selected: false },
      { packageId: 2, price: 3000, selected: true },
      { packageId: 3, price: 0, selected: true }
    ]
  },
  {
    id: 26,
    amount: 0,
    toggle: false,
    individual: false,
    name: "ABRA Business Navigátor – analyzer",
    categoryId: 6,
    note: "ABN je Efektivní nástroj pro finanční plánování a reporting.",
    prices: [
      { packageId: 1, price: 0, selected: false },
      { packageId: 2, price: 1200, selected: true },
      { packageId: 3, price: 1200, selected: true }
    ]
  },
  {
    id: 27,
    amount: 0,
    toggle: false,
    individual: false,
    name: "ABRA Business Navigátor – builder",
    categoryId: 6,
    note: "(Uživatel s možností zadávání dat.)",
    prices: [
      { packageId: 1, price: 0, selected: false },
      { packageId: 2, price: 1200, selected: true },
      { packageId: 3, price: 1200, selected: true }
    ]
  },
  {
    id: 28,
    amount: 0,
    toggle: false,
    individual: false,
    name: "ABRA Business Navigátor – další spojení",
    categoryId: 6,
    note: "Chcete-li využívat ABN pro více IČO.",
    prices: [
      { packageId: 1, price: 0, selected: false },
      { packageId: 2, price: 1200, selected: true },
      { packageId: 3, price: 1200, selected: true }
    ]
  },
  {
    id: 29,
    amount: 0,
    toggle: false,
    individual: false,
    name: "ABRA On-line schvalování",
    categoryId: 6,
    note: "Webová aplikace umožňující schvalovat doklady z prohlížeče či z příchozího e-mailu.",
    prices: [
      { packageId: 1, price: 0, selected: false },
      { packageId: 2, price: 790, selected: true },
      { packageId: 3, price: 790, selected: true }
    ]
  },
  {
    id: 30,
    amount: 0,
    toggle: false,
    individual: false,
    name: "OCR (Optical Character Recognition)",
    categoryId: 6,
    note: "Webová aplikace pro vytěžování příchozích dokladů a jejich uložení do ABRA Gen.",
    prices: [
      { packageId: 1, price: 0, selected: false },
      { packageId: 2, price: 990, selected: true },
      { packageId: 3, price: 990, selected: true }
    ]
  },
  {
    id: 31,
    amount: 0,
    toggle: false,
    individual: false,
    name: "Výrobní terminál (PLM)",
    categoryId: 7,
    note: "Webová aplikace pro pracovníky výroby.",
    prices: [
      { packageId: 1, price: 0, selected: false },
      { packageId: 2, price: 990, selected: true },
      { packageId: 3, price: 990, selected: true }
    ]
  },
  {
    id: 32,
    amount: 0,
    toggle: false,
    individual: false,
    name: "Licence katalogových doplňků",
    categoryId: 8,
    note: "Odesílání výplatních pásek e-mailem. Hromadné zpracování faktur a záloh. Hlášení EKO-KOM. Hromadná fakturace. Billing – automatické generování dokladů. Integrace na MS SharePoint",
    prices: [
      { packageId: 1, price: 0, selected: false },
      { packageId: 2, price: 990, selected: true },
      { packageId: 3, price: 990, selected: true }
    ]
  },
  {
    id: 33,
    amount: 0,
    toggle: false,
    individual: false,
    name: "Garantovaná reakční doba na krizovou situaci vč. řešení zakázkových úprav",
    categoryId: 9,
    prices: [
      { packageId: 1, price: 0, selected: false },
      { packageId: 2, price: 990, selected: true },
      { packageId: 3, price: 990, selected: true }
    ]
  },
  {
    id: 34,
    amount: 0,
    toggle: false,
    individual: false,
    name: "Automatizační server – jedno vlákno",
    categoryId: 14,
    prices: [
      { packageId: 1, price: 0, selected: true },
      { packageId: 2, price: 0, selected: true },
      { packageId: 3, price: 0, selected: true }
    ]
  },
  {
    id: 35,
    amount: 0,
    toggle: false,
    individual: false,
    name: "API každých 16 vláken",
    categoryId: 14,
    prices: [
      { packageId: 1, price: 1790, selected: false },
      { packageId: 2, price: 1790, selected: true },
      { packageId: 3, price: 1790, selected: true }
    ]
  },
  {
    id: 36,
    amount: 0,
    toggle: false,
    individual: false,
    name: "Webové služby",
    categoryId: 14,
    prices: [
      { packageId: 1, price: 1790, selected: false },
      { packageId: 2, price: 1790, selected: true },
      { packageId: 3, price: 1790, selected: true }
    ]
  },
  {
    id: 37,
    amount: 0,
    toggle: false,
    individual: false,
    name: "Provoz ABN pro zákazníky s databází Firebird",
    categoryId: 14,
    prices: [
      { packageId: 1, price: 500, selected: true },
      { packageId: 2, price: 500, selected: true },
      { packageId: 3, price: 500, selected: true }
    ]
  },
  {
    id: 38,
    amount: 0,
    toggle: false,
    individual: false,
    name: "Provoz ABN pro zákazníky s databází MS SQL",
    categoryId: 14,
    prices: [
      { packageId: 1, price: 1000, selected: true },
      { packageId: 2, price: 1000, selected: true },
      { packageId: 3, price: 1000, selected: true }
    ]
  },
  {
    id: 39,
    amount: 0,
    toggle: false,
    individual: false,
    name: "Vzdálený monitoring (on-premise)",
    categoryId: 9,
    note: "Vzdáleně sledujeme vytíženost serveru, funkčnost služeb atp. E-mailová notifikace při zjištění blížícího se problému nebo vzniku nebezpečném stavu (stavový monitoring).",
    prices: [
      { packageId: 1, price: 0, selected: true },
      { packageId: 2, price: 0, selected: true },
      { packageId: 3, price: 0, selected: true }
    ]
  },
  {
    id: 40,
    amount: 0,
    toggle: false,
    individual: false,
    name: "Záložní provoz",
    categoryId: 9,
    note: "Záloha ABRA Gen v ABRA cloudu (Pro on-premise instalace)",
    prices: [
      { packageId: 1, price: 0, selected: false },
      { packageId: 2, price: 1500, selected: true },
      { packageId: 3, price: 0, selected: true }
    ]
  },
  {
    id: 41,
    amount: 0,
    toggle: false,
    individual: false,
    name: "Garantovaná reakční doba na krizovou situaci standardu systému",
    categoryId: 9,
    prices: [
      { packageId: 1, price: 0, selected: true },
      { packageId: 2, price: 0, selected: true },
      { packageId: 3, price: 0, selected: true }
    ]
  },
  {
    id: 42,
    amount: 0,
    toggle: false,
    individual: false,
    name: "Virtuální správce ABRA Gen",
    categoryId: 9,
    prices: [
      { packageId: 1, price: 0, selected: true },
      { packageId: 2, price: 0, selected: true },
      { packageId: 3, price: 0, selected: true }
    ]
  },
  {
    id: 43,
    amount: 0,
    toggle: false,
    individual: false,
    name: "Spáva databáze Oracle",
    categoryId: 9,
    prices: [
      { packageId: 1, price: 0, selected: true },
      { packageId: 2, price: 0, selected: true },
      { packageId: 3, price: 0, selected: true }
    ]
  },
  {
    id: 44,
    amount: 0,
    toggle: false,
    individual: false,
    name: "Spáva databáze MS SQL",
    categoryId: 9,
    prices: [
      { packageId: 1, price: 0, selected: true },
      { packageId: 2, price: 0, selected: true },
      { packageId: 3, price: 0, selected: true }
    ]
  },
  {
    id: 45,
    amount: 0,
    toggle: false,
    individual: false,
    name: "Monitoring databázového serveru Oracle",
    categoryId: 9,
    prices: [
      { packageId: 1, price: 0, selected: true },
      { packageId: 2, price: 0, selected: true },
      { packageId: 3, price: 0, selected: true }
    ]
  },
  {
    id: 46,
    amount: 0,
    toggle: false,
    individual: false,
    name: "Licence pro testovací prostředí",
    categoryId: 9,
    prices: [
      { packageId: 1, price: 0, selected: true },
      { packageId: 2, price: 0, selected: true },
      { packageId: 3, price: 0, selected: true }
    ]
  },
  {
    id: 47,
    amount: 0,
    toggle: false,
    individual: false,
    name: "Preventivní údržba",
    categoryId: 9,
    prices: [
      { packageId: 1, price: 0, selected: true },
      { packageId: 2, price: 0, selected: true },
      { packageId: 3, price: 0, selected: true }
    ]
  },
  {
    id: 48,
    amount: 0,
    toggle: false,
    individual: false,
    name: "Dostupnost nové verze systému a legislativy",
    categoryId: 10,
    prices: [
      { packageId: 1, price: 0, selected: true },
      { packageId: 2, price: 0, selected: true },
      { packageId: 3, price: 0, selected: true }
    ]
  },
  {
    id: 49,
    amount: 0,
    toggle: false,
    individual: false,
    name: "Aktualizace systému vč. garance stejné funkčnosti zakázkových úprav – pro ABRA online i on-prem",
    categoryId: 10,
    prices: [
      { packageId: 1, price: 0, selected: true },
      { packageId: 2, price: 0, selected: true },
      { packageId: 3, price: 0, selected: true }
    ]
  },
  {
    id: 50,
    amount: 0,
    toggle: false,
    individual: false,
    name: "Přidělený account manager",
    categoryId: 12,
    prices: [
      { packageId: 1, price: 0, selected: true },
      { packageId: 2, price: 0, selected: true },
      { packageId: 3, price: 0, selected: true }
    ]
  },
  {
    id: 51,
    amount: 0,
    toggle: false,
    individual: false,
    name: "Písemná hotline",
    categoryId: 12,
    prices: [
      { packageId: 1, price: 0, selected: true },
      { packageId: 2, price: 0, selected: true },
      { packageId: 3, price: 0, selected: true }
    ]
  },
  {
    id: 52,
    amount: 0,
    toggle: false,
    individual: false,
    name: "Telefonní hotline",
    categoryId: 12,
    prices: [
      { packageId: 1, price: 500, selected: true },
      { packageId: 2, price: 0, selected: true },
      { packageId: 3, price: 0, selected: true }
    ]
  },
  {
    id: 53,
    amount: 0,
    toggle: false,
    individual: false,
    name: "Přednostní odbavení na hotline",
    categoryId: 12,
    prices: [
      { packageId: 1, price: 0, selected: true },
      { packageId: 2, price: 0, selected: true },
      { packageId: 3, price: 0, selected: true }
    ]
  },
  {
    id: 54,
    amount: 0,
    toggle: false,
    individual: false,
    name: "Uživatelské videokurzy",
    categoryId: 12,
    prices: [
      { packageId: 1, price: 0, selected: true },
      { packageId: 2, price: 0, selected: true },
      { packageId: 3, price: 0, selected: true }
    ]
  },
  {
    id: 55,
    amount: 0,
    toggle: false,
    individual: false,
    name: "Videokurzy pro pokročilé uživatele",
    categoryId: 12,
    prices: [
      { packageId: 1, price: 0, selected: true },
      { packageId: 2, price: 0, selected: true },
      { packageId: 3, price: 0, selected: true }
    ]
  },
  {
    id: 56,
    amount: 0,
    toggle: false,
    individual: false,
    name: "Strategická konzultace k využití Abry ke zlepšení byznysu",
    categoryId: 12,
    note: "ročně 4 hodiny konzultace se zápisem s konkrétními návrhy",
    prices: [
      { packageId: 1, price: 0, selected: true },
      { packageId: 2, price: 0, selected: true },
      { packageId: 3, price: 0, selected: true }
    ]
  },
  {
    id: 57,
    amount: 0,
    toggle: false,
    individual: false,
    name: "Přednostní péče",
    categoryId: 13,
    note: "Přednostní odbavení na hotline, Garantovaná reakční doba, Přednostní odbavení požadavků, Předplacené konzultační práce",
    prices: [
      { packageId: 1, price: 0, selected: true },
      { packageId: 2, price: 0, selected: true },
      { packageId: 3, price: 0, selected: true }
    ]
  },
  {
    id: 58,
    amount: 0,
    toggle: false,
    individual: false,
    name: "Péče all-inclusive",
    categoryId: 13,
    note: "Individuálně přizpůsobený balíček služeb –např. předplacené konzultační práce, přednostní odbavení hotline i požadavků, monitoring systému, zálohování do ABRA cloudu, profylaxe",
    prices: [
      { packageId: 1, price: 0, selected: true },
      { packageId: 2, price: 0, selected: true },
      { packageId: 3, price: 0, selected: true }
    ]
  },
  {
    id: 59,
    amount: 0,
    toggle: false,
    individual: false,
    name: "ABRA online",
    categoryId: 14,
    note: "Plynulý provoz systému v cloudovém prostředí s komplexní péčí a špičkovým zabezpečením.",
    prices: [
      { packageId: 1, price: 1290, selected: true },
      { packageId: 2, price: 1390, selected: true },
      { packageId: 3, price: 1390, selected: true }
    ]
  },
  {
    id: 60,
    amount: 0,
    toggle: false,
    individual: false,
    name: "Aktualizace vč. podporovaných add-onů s výjimkou BI a WMS",
    categoryId: 14,
    prices: [
      { packageId: 1, price: 0, selected: true },
      { packageId: 2, price: 0, selected: true },
      { packageId: 3, price: 0, selected: true }
    ]
  },
  {
    id: 61,
    amount: 0,
    toggle: false,
    individual: false,
    name: "Provoz rozhranní pro ABRA Apps",
    categoryId: 14,
    prices: [
      { packageId: 1, price: 0, selected: true },
      { packageId: 2, price: 0, selected: true },
      { packageId: 3, price: 0, selected: true }
    ]
  },
  {
    id: 62,
    amount: 0,
    toggle: false,
    individual: false,
    name: "Provoz ABRA On-line schvalování",
    categoryId: 14,
    prices: [
      { packageId: 1, price: 0, selected: true },
      { packageId: 2, price: 0, selected: true },
      { packageId: 3, price: 0, selected: true }
    ]
  },
  {
    id: 63,
    amount: 0,
    toggle: false,
    individual: false,
    name: "Virtuální server Basic",
    categoryId: 14,
    prices: [
      { packageId: 1, price: 0, selected: true },
      { packageId: 2, price: 0, selected: true },
      { packageId: 3, price: 0, selected: true }
    ]
  },
  {
    id: 64,
    amount: 0,
    toggle: false,
    individual: false,
    name: "Virtuální server Power",
    categoryId: 14,
    prices: [
      { packageId: 1, price: 0, selected: true },
      { packageId: 2, price: 0, selected: true },
      { packageId: 3, price: 0, selected: true }
    ]
  },
  {
    id: 65,
    amount: 0,
    toggle: false,
    individual: false,
    name: "Provoz ABRA BI",
    categoryId: 14,
    prices: [
      { packageId: 1, price: 0, selected: true },
      { packageId: 2, price: 0, selected: true },
      { packageId: 3, price: 0, selected: true }
    ]
  },
  {
    id: 66,
    amount: 0,
    toggle: false,
    individual: false,
    name: "Automatizační server – paralelní zpracování úloh",
    categoryId: 14,
    prices: [
      { packageId: 1, price: 0, selected: true },
      { packageId: 2, price: 0, selected: true },
      { packageId: 3, price: 0, selected: true }
    ]
  },
  {
    id: 67,
    amount: 0,
    toggle: false,
    individual: false,
    name: "Využívaná data nad 10 GB",
    categoryId: 14,
    note: "fakturace dle skutečnosti",
    prices: [
      { packageId: 1, price: 0, selected: true },
      { packageId: 2, price: 0, selected: true },
      { packageId: 3, price: 0, selected: true }
    ]
  },
  {
    id: 68,
    amount: 0,
    toggle: false,
    individual: false,
    name: "MS Office",
    categoryId: 14,
    prices: [
      { packageId: 1, price: 0, selected: true },
      { packageId: 2, price: 0, selected: true },
      { packageId: 3, price: 0, selected: true }
    ]
  },
  {
    id: 69,
    amount: 0,
    toggle: false,
    individual: false,
    name: "Provoz ABRA E-shop",
    categoryId: 14,
    prices: [
      { packageId: 1, price: 0, selected: true },
      { packageId: 2, price: 0, selected: true },
      { packageId: 3, price: 0, selected: true }
    ]
  },
  {
    id: 70,
    amount: 0,
    toggle: false,
    individual: false,
    name: "2FA – dvoufaktorová autentizace za uživatele",
    categoryId: 14,
    prices: [
      { packageId: 1, price: 0, selected: true },
      { packageId: 2, price: 0, selected: true },
      { packageId: 3, price: 0, selected: true }
    ]
  },
  {
    id: 71,
    amount: 0,
    toggle: false,
    individual: false,
    name: "Základní hodinová sazba",
    categoryId: 15,
    prices: [
      { packageId: 1, price: 0, selected: true },
      { packageId: 2, price: 0, selected: true },
      { packageId: 3, price: 0, selected: true }
    ]
  },
  {
    id: 80,
    amount: 0,
    toggle: false,
    individual: false,
    name: "Pohotovost 13x7x4",
    categoryId: 14,
    prices: [
      { packageId: 1, price: 0, selected: true },
      { packageId: 2, price: 0, selected: true },
      { packageId: 3, price: 0, selected: true }
    ]
  },
  {
    id: 87,
    amount: 0,
    toggle: false,
    individual: false,
    name: "Zákázkové úpravy od Abry a certifikovaných partnerů",
    categoryId: 11,
    prices: [
      { packageId: 1, price: 0, selected: true },
      { packageId: 2, price: 0, selected: true },
      { packageId: 3, price: 0, selected: true }
    ]
  },
  {
    id: 88,
    amount: 0,
    toggle: false,
    individual: false,
    name: "Vlastní skriptování",
    categoryId: 11,
    prices: [
      { packageId: 1, price: 0, selected: true },
      { packageId: 2, price: 0, selected: true },
      { packageId: 3, price: 0, selected: true }
    ]
  },
  {
    id: 91,
    amount: 0,
    toggle: false,
    individual: false,
    name: "Příplatek za práci v noci a mimo pracovní dny",
    categoryId: 15,
    prices: [
      { packageId: 1, price: 0, selected: true },
      { packageId: 2, price: 0, selected: true },
      { packageId: 3, price: 0, selected: true }
    ]
  }
];