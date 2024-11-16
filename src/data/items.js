export const defaultItems = [
  {
    id: 1,
    amount: 0,
    checkbox: false,
    individual: false,
    name: "Počet uživatelů s plným přístupem",
    categoryId: 1,
    note: "Pojmenovaní uživatelé (ne konkurenční)",
    prices: [
      { packageId: 1, price: 1391, selected: false},
      { packageId: 2, price: 1691, selected: true},
      { packageId: 3, price: 2000, selected: true}
    ]
  },
  {
    id: 4,
    amount: 0,
    checkbox: false,
    individual: false,
    name: "Read-only uživatelé",
    note: "pojmenovaní uživatelé, nepočítají se do celkového počtu uživatelů a nemají právo na API",
    categoryId: 1,
    prices: [
      { packageId: 1, price: 0, selected: false },
      { packageId: 2, price: 845, selected: true},
      { packageId: 3, price: 995, selected: true}
    ]
  },
  {
    id: 5,
    amount: 0,
    checkbox: false,
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
    checkbox: false,
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
    checkbox: false,
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
    checkbox: false,
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
    checkbox: false,
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
    checkbox: false,
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
    checkbox: false,
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
    checkbox: false,
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
    checkbox: false,
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
    checkbox: false,
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
    checkbox: false,
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
    checkbox: false,
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
    checkbox: false,
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
    checkbox: false,
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
    checkbox: false,
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
    checkbox: false,
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
    checkbox: false,
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
    checkbox: false,
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
    checkbox: false,
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
    checkbox: false,
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
    checkbox: false,
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
    checkbox: false,
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
    checkbox: false,
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
    checkbox: false,
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
    checkbox: false,
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
    checkbox: false,
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
    checkbox: false,
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
    checkbox: false,
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
    checkbox: false,
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
    checkbox: false,
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
    checkbox: false,
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
    checkbox: false,
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
    checkbox: false,
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
    checkbox: false,
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
    checkbox: false,
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
    checkbox: false,
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
    checkbox: false,
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
    checkbox: false,
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
    checkbox: false,
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
    checkbox: false,
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
    checkbox: false,
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
    checkbox: false,
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
    checkbox: false,
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
    checkbox: false,
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
    checkbox: false,
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
    checkbox: false,
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
    checkbox: false,
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
    checkbox: false,
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
    checkbox: false,
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
    checkbox: false,
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
    checkbox: false,
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
    checkbox: false,
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
    checkbox: false,
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
    checkbox: false,
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
    checkbox: false,
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
    checkbox: false,
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
    checkbox: false,
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
    checkbox: false,
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
    checkbox: false,
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
    checkbox: false,
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
    checkbox: false,
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
    checkbox: false,
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
    checkbox: false,
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
    checkbox: false,
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
    checkbox: false,
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
    checkbox: false,
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