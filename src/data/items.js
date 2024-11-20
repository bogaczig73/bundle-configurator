export const defaultItems = [
  {
    "id": 1,
    "name": "Počet uživatelů s plným přístupem",
    "categoryId": 1,
    "packages": [
      {
        "packageId": 1,
        "price": 1391,
        "selected": false
      },
      {
        "price": 1690,
        "packageId": 2,
        "selected": true
      },
      {
        "selected": true,
        "packageId": 3,
        "price": 1990
      }
    ],
    "amount": 0,
    "checkbox": false,
    "individual": false,
    "note": "Pojmenovaní uživatelé (ne konkurenční)"
  },
  {
    "id": 4,
    "name": "Read-only uživatelé",
    "categoryId": 1,
    "packages": [
      {
        "price": 0,
        "selected": false,
        "packageId": 1
      },
      {
        "packageId": 2,
        "selected": true,
        "price": 845
      },
      {
        "packageId": 3,
        "price": 995,
        "selected": true
      }
    ],
    "amount": 0,
    "checkbox": false,
    "individual": false,
    "note": "pojmenovaní uživatelé, nepočítají se do celkového počtu uživatelů a nemají právo na API"
  },
  {
    "id": 5,
    "name": "Správa uživatelů a předplatných v novém Zákaznickém portálu",
    "categoryId": 1,
    "packages": [
      {
        "packageId": 1,
        "selected": true,
        "price": 0
      },
      {
        "packageId": 2,
        "selected": true,
        "price": 0
      },
      {
        "price": 0,
        "selected": true,
        "packageId": 3
      }
    ],
    "amount": 0,
    "checkbox": false,
    "individual": false
  },
  {
    "id": 6,
    "name": "API",
    "categoryId": 1,
    "packages": [
      {
        "packageId": 1,
        "price": 0,
        "selected": false
      },
      {
        "price": 1690,
        "selected": true,
        "packageId": 2
      },
      {
        "price": 1990,
        "packageId": 3,
        "selected": true
      }
    ],
    "amount": 0,
    "checkbox": false,
    "individual": false
  },
  {
    "id": 7,
    "name": "Systém pro více IČO",
    "categoryId": 2,
    "packages": [
      {
        "packageId": 1,
        "selected": false,
        "price": 0
      },
      {
        "selected": true,
        "price": 1250,
        "packageId": 2
      },
      {
        "price": 1250,
        "packageId": 3,
        "selected": true
      }
    ],
    "amount": 0,
    "checkbox": false,
    "individual": false
  },
  {
    "id": 8,
    "name": "Počet IČO v ceně",
    "categoryId": 2,
    "packages": [
      {
        "price": 0,
        "packageId": 1,
        "selected": false
      },
      {
        "price": 2,
        "packageId": 2,
        "selected": true
      },
      {
        "selected": true,
        "packageId": 3,
        "price": 5
      }
    ],
    "amount": 0,
    "checkbox": false,
    "individual": false
  },
  {
    "id": 9,
    "name": "Databáze",
    "categoryId": 2,
    "packages": [
      {
        "price": 0,
        "packageId": 1,
        "selected": false
      },
      {
        "price": 0,
        "packageId": 2,
        "selected": true
      },
      {
        "packageId": 3,
        "price": 0,
        "selected": true
      }
    ],
    "amount": 0,
    "checkbox": false,
    "individual": false
  },
  {
    "id": 10,
    "name": "API",
    "categoryId": 2,
    "packages": [
      {
        "packageId": 1,
        "selected": false,
        "price": 0
      },
      {
        "selected": true,
        "price": 0,
        "packageId": 2
      },
      {
        "price": 0,
        "selected": true,
        "packageId": 3
      }
    ],
    "amount": 0,
    "checkbox": false,
    "individual": false
  },
  {
    "id": 15,
    "name": "Výroba",
    "categoryId": 3,
    "packages": [
      {
        "price": 0,
        "selected": false,
        "packageId": 1
      },
      {
        "packageId": 2,
        "price": 200,
        "selected": true
      },
      {
        "selected": true,
        "price": 0,
        "packageId": 3
      }
    ],
    "amount": 0,
    "checkbox": false,
    "individual": false,
    "note": "Výroba, IoT"
  },
  {
    "id": 16,
    "name": "Mzdy a personalistika",
    "categoryId": 3,
    "packages": [
      {
        "price": 1000,
        "packageId": 1,
        "selected": false
      },
      {
        "price": 1000,
        "selected": true,
        "packageId": 2
      },
      {
        "price": 1000,
        "packageId": 3,
        "selected": true
      }
    ],
    "amount": 0,
    "checkbox": false,
    "individual": false,
    "note": "Mzdy a personalistika, Docházka"
  },
  {
    "id": 17,
    "name": "EDI",
    "categoryId": 5,
    "packages": [
      {
        "selected": false,
        "packageId": 1,
        "price": 0
      },
      {
        "price": 2000,
        "selected": true,
        "packageId": 2
      },
      {
        "selected": true,
        "packageId": 3,
        "price": 0
      }
    ],
    "amount": 0,
    "checkbox": true,
    "individual": false,
    "note": "Elektronická výměna dat a dokladů mezi společnostmi a jejich ERP systémy"
  },
  {
    "id": 18,
    "name": "E-shop / B2B portal",
    "categoryId": 5,
    "packages": [
      {
        "price": 0,
        "selected": false,
        "packageId": 1
      },
      {
        "price": 4000,
        "selected": true,
        "packageId": 2
      },
      {
        "price": 4000,
        "selected": true,
        "packageId": 3
      }
    ],
    "amount": 0,
    "checkbox": false,
    "individual": false,
    "note": "E-shop od ABRA Software ve standardní šabloně + stavový monitoring systému (e-mailová notifikace o běhu e-shopu a proaktivní řešení v případě blížící se chyby nebo krizového stavu) v ceně"
  },
  {
    "id": 19,
    "name": "E-shop – jazyková mutace",
    "categoryId": 5,
    "packages": [
      {
        "price": 0,
        "packageId": 1,
        "selected": false
      },
      {
        "price": 1000,
        "packageId": 2,
        "selected": true
      },
      {
        "packageId": 3,
        "price": 1000,
        "selected": true
      }
    ],
    "amount": 0,
    "checkbox": false,
    "individual": false,
    "note": "Podpora češtiny, slovenštiny, angličtiny a němčiny."
  },
  {
    "id": 20,
    "name": "E-shop - zakázkový e-shop",
    "categoryId": 5,
    "packages": [
      {
        "selected": false,
        "packageId": 1,
        "price": 0
      },
      {
        "packageId": 2,
        "selected": true,
        "price": 8000
      },
      {
        "packageId": 3,
        "selected": true,
        "price": 8000
      }
    ],
    "amount": 0,
    "checkbox": false,
    "individual": false,
    "note": "E-shop od ABRA Software v šabloně na míru"
  },
  {
    "id": 21,
    "name": "Expedice balíků – integrace služby Balíkobot.cz",
    "categoryId": 5,
    "packages": [
      {
        "price": 0,
        "packageId": 1,
        "selected": false
      },
      {
        "price": 0,
        "packageId": 2,
        "selected": true
      },
      {
        "price": 0,
        "packageId": 3,
        "selected": true
      }
    ],
    "amount": 0,
    "checkbox": false,
    "individual": false,
    "note": "Automatická expedice balíků z vašeho systému na jeden klik."
  },
  {
    "id": 22,
    "name": "Mobilní skladník",
    "categoryId": 5,
    "packages": [
      {
        "price": 0,
        "selected": false,
        "packageId": 1
      },
      {
        "price": 1200,
        "selected": true,
        "packageId": 2
      },
      {
        "price": 1200,
        "packageId": 3,
        "selected": true
      }
    ],
    "amount": 0,
    "checkbox": false,
    "individual": false,
    "note": "Aplikace pro správu skladového hospodářství na mobilních terminálech a zařízeních na platformě Android."
  },
  {
    "id": 23,
    "name": "Obchodní referent",
    "categoryId": 5,
    "packages": [
      {
        "price": 0,
        "selected": false,
        "packageId": 1
      },
      {
        "selected": true,
        "price": 790,
        "packageId": 2
      },
      {
        "selected": true,
        "price": 790,
        "packageId": 3
      }
    ],
    "amount": 0,
    "checkbox": false,
    "individual": false,
    "note": "Webová aplikace pro práci s objednávkami."
  },
  {
    "id": 24,
    "name": "Mobilní servis",
    "categoryId": 5,
    "packages": [
      {
        "selected": false,
        "price": 0,
        "packageId": 1
      },
      {
        "price": 990,
        "selected": true,
        "packageId": 2
      },
      {
        "selected": true,
        "packageId": 3,
        "price": 990
      }
    ],
    "amount": 0,
    "checkbox": false,
    "individual": false,
    "note": "Webová aplikace pro práci servisních techniků."
  },
  {
    "id": 25,
    "name": "ABRA BI (obsahuje standardní BI reporty)",
    "categoryId": 6,
    "packages": [
      {
        "selected": false,
        "packageId": 1,
        "price": 0
      },
      {
        "packageId": 2,
        "selected": true,
        "price": 3000
      },
      {
        "price": 0,
        "packageId": 3,
        "selected": true
      }
    ],
    "amount": 0,
    "checkbox": true,
    "individual": false,
    "note": "Business Intelligence pro celkový přehled o firmě."
  },
  {
    "id": 26,
    "name": "ABRA Business Navigátor – analyzer",
    "categoryId": 6,
    "packages": [
      {
        "price": 0,
        "selected": false,
        "packageId": 1
      },
      {
        "packageId": 2,
        "price": 1200,
        "selected": true
      },
      {
        "packageId": 3,
        "selected": true,
        "price": 1200
      }
    ],
    "amount": 0,
    "checkbox": false,
    "individual": false,
    "note": "ABN je Efektivní nástroj pro finanční plánování a reporting."
  },
  {
    "id": 27,
    "name": "ABRA Business Navigátor – builder",
    "categoryId": 6,
    "packages": [
      {
        "price": 0,
        "selected": false,
        "packageId": 1
      },
      {
        "price": 1200,
        "packageId": 2,
        "selected": true
      },
      {
        "selected": true,
        "packageId": 3,
        "price": 1900
      }
    ],
    "amount": 0,
    "checkbox": false,
    "individual": false,
    "note": "(Uživatel s možností zadávání dat.)"
  },
  {
    "id": 28,
    "name": "ABRA Business Navigátor – další spojení",
    "categoryId": 6,
    "packages": [
      {
        "price": 0,
        "selected": false,
        "packageId": 1
      },
      {
        "packageId": 2,
        "selected": true,
        "price": 1200
      },
      {
        "price": 1700,
        "selected": true,
        "packageId": 3
      }
    ],
    "amount": 0,
    "checkbox": false,
    "individual": false,
    "note": "Chcete-li využívat ABN pro více IČO."
  },
  {
    "id": 29,
    "name": "ABRA On-line schvalování",
    "categoryId": 6,
    "packages": [
      {
        "price": 0,
        "selected": false,
        "packageId": 1
      },
      {
        "selected": true,
        "packageId": 2,
        "price": 790
      },
      {
        "selected": true,
        "packageId": 3,
        "price": 290
      }
    ],
    "amount": 0,
    "checkbox": false,
    "individual": false,
    "note": "Webová aplikace umožňující schvalovat doklady z prohlížeče či z příchozího e-mailu."
  },
  {
    "id": 30,
    "name": "OCR (Optical Character Recognition)",
    "categoryId": 6,
    "packages": [
      {
        "selected": false,
        "packageId": 1,
        "price": 0
      },
      {
        "price": 990,
        "selected": true,
        "packageId": 2
      },
      {
        "price": 789,
        "packageId": 3,
        "selected": true
      }
    ],
    "amount": 0,
    "checkbox": false,
    "individual": false,
    "note": "Webová aplikace pro vytěžování příchozích dokladů a jejich uložení do ABRA Gen."
  },
  {
    "id": 31,
    "name": "Výrobní terminál (PLM)",
    "categoryId": 7,
    "packages": [
      {
        "packageId": 1,
        "selected": false,
        "price": 0
      },
      {
        "selected": true,
        "price": 990,
        "packageId": 2
      },
      {
        "price": 588,
        "packageId": 3,
        "selected": true
      }
    ],
    "amount": 0,
    "checkbox": false,
    "individual": false,
    "note": "Webová aplikace pro pracovníky výroby."
  },
  {
    "id": 32,
    "name": "Licence katalogových doplňků",
    "categoryId": 8,
    "packages": [
      {
        "selected": false,
        "packageId": 1,
        "price": 0
      },
      {
        "selected": true,
        "packageId": 2,
        "price": 990
      },
      {
        "packageId": 3,
        "selected": true,
        "price": 990
      }
    ],
    "amount": 0,
    "checkbox": false,
    "individual": false,
    "note": "Odesílání výplatních pásek e-mailem. Hromadné zpracování faktur a záloh. Hlášení EKO-KOM. Hromadná fakturace. Billing – automatické generování dokladů. Integrace na MS SharePoint"
  },
  {
    "id": 39,
    "name": "Vzdálený monitoring (on-premise)",
    "categoryId": 9,
    "packages": [
      {
        "selected": false,
        "price": 0,
        "packageId": 1
      },
      {
        "packageId": 2,
        "selected": true,
        "price": 1500
      },
      {
        "packageId": 3,
        "selected": true,
        "price": 0
      }
    ],
    "amount": 0,
    "checkbox": true,
    "individual": false,
    "note": "Vzdáleně sledujeme vytíženost serveru, funkčnost služeb atp. E-mailová notifikace při zjištění blížícího se problému nebo vzniku nebezpečném stavu (stavový monitoring)."
  },
  {
    "id": 40,
    "name": "Záložní provoz",
    "categoryId": 9,
    "packages": [
      {
        "packageId": 1,
        "price": 0,
        "selected": false
      },
      {
        "packageId": 2,
        "selected": true,
        "price": 1500
      },
      {
        "selected": true,
        "packageId": 3,
        "price": 0
      }
    ],
    "amount": 0,
    "checkbox": true,
    "individual": false,
    "note": "Záloha ABRA Gen v ABRA cloudu (Pro on-premise instalace)"
  },
  {
    "id": 41,
    "name": "Garantovaná reakční doba na krizovou situaci standardu systému",
    "categoryId": 9,
    "packages": [
      {
        "packageId": 1,
        "selected": true,
        "price": 0
      },
      {
        "selected": true,
        "price": 0,
        "packageId": 2
      },
      {
        "packageId": 3,
        "selected": true,
        "price": 0
      }
    ],
    "amount": 0,
    "checkbox": false,
    "individual": false
  },
  {
    "id": 33,
    "name": "Garantovaná reakční doba na krizovou situaci vč. řešení zakázkových úprav",
    "categoryId": 9,
    "packages": [
      {
        "selected": false,
        "price": 0,
        "packageId": 1
      },
      {
        "price": 0,
        "selected": true,
        "packageId": 2
      },
      {
        "price": 0,
        "selected": true,
        "packageId": 3
      }
    ],
    "amount": 0,
    "checkbox": false,
    "individual": true
  },
  {
    "id": 42,
    "name": "Virtuální správce ABRA Gen",
    "categoryId": 9,
    "packages": [
      {
        "selected": false,
        "packageId": 1,
        "price": 0
      },
      {
        "selected": true,
        "packageId": 2,
        "price": 0
      },
      {
        "price": 0,
        "selected": true,
        "packageId": 3
      }
    ],
    "amount": 0,
    "checkbox": false,
    "individual": true
  },
  {
    "id": 43,
    "name": "Spáva databáze Oracle",
    "categoryId": 9,
    "packages": [
      {
        "price": 0,
        "selected": false,
        "packageId": 1
      },
      {
        "price": 0,
        "selected": false,
        "packageId": 2
      },
      {
        "price": 40000,
        "selected": true,
        "packageId": 3
      }
    ],
    "amount": 0,
    "checkbox": false,
    "individual": false
  },
  {
    "id": 44,
    "name": "Spáva databáze MS SQL",
    "categoryId": 9,
    "packages": [
      {
        "selected": false,
        "price": 0,
        "packageId": 1
      },
      {
        "packageId": 2,
        "selected": false,
        "price": 0
      },
      {
        "price": 17000,
        "packageId": 3,
        "selected": true
      }
    ],
    "amount": 0,
    "checkbox": false,
    "individual": false
  },
  {
    "id": 45,
    "name": "Monitoring databázového serveru Oracle",
    "categoryId": 9,
    "packages": [
      {
        "selected": false,
        "packageId": 1,
        "price": 0
      },
      {
        "selected": false,
        "packageId": 2,
        "price": 0
      },
      {
        "selected": true,
        "packageId": 3,
        "price": 7000
      }
    ],
    "amount": 0,
    "checkbox": false,
    "individual": false
  },
  {
    "id": 46,
    "name": "Licence pro testovací prostředí",
    "categoryId": 9,
    "packages": [
      {
        "packageId": 1,
        "selected": true,
        "price": 0
      },
      {
        "price": 0,
        "selected": true,
        "packageId": 2
      },
      {
        "selected": true,
        "packageId": 3,
        "price": 0
      }
    ],
    "amount": 0,
    "checkbox": false,
    "individual": false
  },
  {
    "id": 47,
    "name": "Preventivní údržba",
    "categoryId": 9,
    "packages": [
      {
        "selected": true,
        "packageId": 1,
        "price": 0
      },
      {
        "packageId": 2,
        "price": 0,
        "selected": true
      },
      {
        "price": 0,
        "packageId": 3,
        "selected": true
      }
    ],
    "amount": 0,
    "checkbox": false,
    "individual": true
  },
  {
    "id": 48,
    "name": "Dostupnost nové verze systému a legislativy",
    "categoryId": 10,
    "packages": [
      {
        "selected": true,
        "price": 0,
        "packageId": 1
      },
      {
        "packageId": 2,
        "selected": true,
        "price": 0
      },
      {
        "selected": true,
        "price": 0,
        "packageId": 3
      }
    ],
    "amount": 0,
    "checkbox": false,
    "individual": false
  },
  {
    "id": 49,
    "name": "Aktualizace systému vč. garance stejné funkčnosti zakázkových úprav – pro ABRA online i on-prem",
    "categoryId": 10,
    "packages": [
      {
        "packageId": 1,
        "selected": false,
        "price": 0
      },
      {
        "selected": true,
        "packageId": 2,
        "price": 0
      },
      {
        "packageId": 3,
        "selected": true,
        "price": 0
      }
    ],
    "amount": 0,
    "checkbox": false,
    "individual": true
  },
  {
    "id": 87,
    "name": "Zákázkové úpravy od Abry a certifikovaných partnerů",
    "categoryId": 11,
    "packages": [
      {
        "selected": true,
        "packageId": 1,
        "price": 0
      },
      {
        "price": 0,
        "packageId": 2,
        "selected": true
      },
      {
        "selected": true,
        "packageId": 3,
        "price": 0
      }
    ],
    "amount": 0,
    "checkbox": false,
    "individual": false
  },
  {
    "id": 88,
    "name": "Vlastní skriptování",
    "categoryId": 11,
    "packages": [
      {
        "selected": false,
        "price": 0,
        "packageId": 1
      },
      {
        "packageId": 2,
        "selected": false,
        "price": 0
      },
      {
        "price": 0,
        "packageId": 3,
        "selected": true
      }
    ],
    "amount": 0,
    "checkbox": false,
    "individual": false
  },
  {
    "id": 50,
    "name": "Přidělený account manager",
    "categoryId": 12,
    "packages": [
      {
        "price": 0,
        "selected": true,
        "packageId": 1
      },
      {
        "packageId": 2,
        "price": 0,
        "selected": true
      },
      {
        "packageId": 3,
        "selected": true,
        "price": 0
      }
    ],
    "amount": 0,
    "checkbox": false,
    "individual": false
  },
  {
    "id": 51,
    "name": "Písemná hotline",
    "categoryId": 12,
    "packages": [
      {
        "selected": true,
        "price": 0,
        "packageId": 1
      },
      {
        "price": 0,
        "packageId": 2,
        "selected": true
      },
      {
        "packageId": 3,
        "selected": true,
        "price": 0
      }
    ],
    "amount": 0,
    "checkbox": false,
    "individual": false
  },
  {
    "id": 52,
    "name": "Telefonní hotline",
    "categoryId": 12,
    "packages": [
      {
        "packageId": 1,
        "price": 500,
        "selected": true
      },
      {
        "selected": true,
        "price": 0,
        "packageId": 2
      },
      {
        "selected": true,
        "packageId": 3,
        "price": 0
      }
    ],
    "amount": 0,
    "checkbox": false,
    "individual": false
  },
  {
    "id": 53,
    "name": "Přednostní odbavení na hotline",
    "categoryId": 12,
    "packages": [
      {
        "price": 0,
        "packageId": 1,
        "selected": true
      },
      {
        "packageId": 2,
        "price": 0,
        "selected": false
      },
      {
        "selected": true,
        "packageId": 3,
        "price": 0
      }
    ],
    "amount": 0,
    "checkbox": false,
    "individual": false
  },
  {
    "id": 54,
    "name": "Uživatelské videokurzy",
    "categoryId": 12,
    "packages": [
      {
        "packageId": 1,
        "selected": true,
        "price": 0
      },
      {
        "selected": true,
        "price": 0,
        "packageId": 2
      },
      {
        "packageId": 3,
        "price": 0,
        "selected": true
      }
    ],
    "amount": 0,
    "checkbox": false,
    "individual": false
  },
  {
    "id": 55,
    "name": "Videokurzy pro pokročilé uživatele",
    "categoryId": 12,
    "packages": [
      {
        "selected": true,
        "price": 0,
        "packageId": 1
      },
      {
        "price": 0,
        "selected": true,
        "packageId": 2
      },
      {
        "packageId": 3,
        "price": 0,
        "selected": true
      }
    ],
    "amount": 0,
    "checkbox": false,
    "individual": false
  },
  {
    "id": 56,
    "name": "Strategická konzultace k využití Abry ke zlepšení byznysu",
    "categoryId": 12,
    "packages": [
      {
        "packageId": 1,
        "price": 0,
        "selected": true
      },
      {
        "price": 27000,
        "selected": true,
        "packageId": 2
      },
      {
        "price": 0,
        "packageId": 3,
        "selected": true
      }
    ],
    "amount": 0,
    "checkbox": true,
    "individual": false,
    "note": "ročně 4 hodiny konzultace se zápisem s konkrétními návrhy"
  },
  {
    "id": 57,
    "name": "Přednostní péče",
    "categoryId": 13,
    "packages": [
      {
        "packageId": 1,
        "selected": true,
        "price": 0
      },
      {
        "price": 0,
        "packageId": 2,
        "selected": true
      },
      {
        "packageId": 3,
        "price": 0,
        "selected": true
      }
    ],
    "amount": 0,
    "checkbox": false,
    "individual": true,
    "note": "Přednostní odbavení na hotline, Garantovaná reakční doba, Přednostní odbavení požadavků, Předplacené konzultační práce"
  },
  {
    "id": 58,
    "name": "Péče all-inclusive",
    "categoryId": 13,
    "packages": [
      {
        "packageId": 1,
        "price": 0,
        "selected": true
      },
      {
        "price": 0,
        "selected": true,
        "packageId": 2
      },
      {
        "packageId": 3,
        "selected": true,
        "price": 0
      }
    ],
    "amount": 0,
    "checkbox": false,
    "individual": true,
    "note": "Individuálně přizpůsobený balíček služeb –např. předplacené konzultační práce, přednostní odbavení hotline i požadavků, monitoring systému, zálohování do ABRA cloudu, profylaxe"
  },
  {
    "id": 59,
    "name": "ABRA online",
    "categoryId": 14,
    "packages": [
      {
        "selected": true,
        "price": 1290,
        "packageId": 1
      },
      {
        "selected": true,
        "price": 1390,
        "packageId": 2
      },
      {
        "selected": true,
        "price": 1390,
        "packageId": 3
      }
    ],
    "amount": 0,
    "checkbox": false,
    "individual": false,
    "note": "Plynulý provoz systému v cloudovém prostředí s komplexní péčí a špičkovým zabezpečením."
  },
  {
    "id": 60,
    "name": "Aktualizace vč. podporovaných add-onů s výjimkou BI a WMS",
    "categoryId": 14,
    "packages": [
      {
        "price": 0,
        "selected": true,
        "packageId": 1
      },
      {
        "selected": true,
        "price": 0,
        "packageId": 2
      },
      {
        "selected": true,
        "packageId": 3,
        "price": 0
      }
    ],
    "amount": 0,
    "checkbox": false,
    "individual": false
  },
  {
    "id": 34,
    "name": "Automatizační server – jedno vlákno",
    "categoryId": 14,
    "packages": [
      {
        "price": 0,
        "selected": true,
        "packageId": 1
      },
      {
        "packageId": 2,
        "price": 0,
        "selected": true
      },
      {
        "selected": true,
        "price": 0,
        "packageId": 3
      }
    ],
    "amount": 0,
    "checkbox": false,
    "individual": false
  },
  {
    "id": 61,
    "name": "Provoz rozhranní pro ABRA Apps",
    "categoryId": 14,
    "packages": [
      {
        "packageId": 1,
        "price": 0,
        "selected": true
      },
      {
        "price": 0,
        "packageId": 2,
        "selected": true
      },
      {
        "price": 0,
        "selected": true,
        "packageId": 3
      }
    ],
    "amount": 0,
    "checkbox": false,
    "individual": false
  },
  {
    "id": 62,
    "name": "Provoz ABRA On-line schvalování",
    "categoryId": 14,
    "packages": [
      {
        "packageId": 1,
        "price": 0,
        "selected": true
      },
      {
        "selected": true,
        "price": 0,
        "packageId": 2
      },
      {
        "price": 0,
        "selected": true,
        "packageId": 3
      }
    ],
    "amount": 0,
    "checkbox": false,
    "individual": false
  },
  {
    "id": 35,
    "name": "API každých 16 vláken",
    "categoryId": 14,
    "packages": [
      {
        "packageId": 1,
        "price": 1790,
        "selected": false
      },
      {
        "price": 1790,
        "selected": true,
        "packageId": 2
      },
      {
        "price": 1790,
        "selected": true,
        "packageId": 3
      }
    ],
    "amount": 0,
    "checkbox": false,
    "individual": false
  },
  {
    "id": 36,
    "name": "Webové služby",
    "categoryId": 14,
    "packages": [
      {
        "packageId": 1,
        "price": 1790,
        "selected": false
      },
      {
        "selected": true,
        "packageId": 2,
        "price": 1790
      },
      {
        "price": 1790,
        "selected": true,
        "packageId": 3
      }
    ],
    "amount": 0,
    "checkbox": false,
    "individual": false
  },
  {
    "id": 63,
    "name": "Virtuální server Basic",
    "categoryId": 14,
    "packages": [
      {
        "price": 1280,
        "selected": true,
        "packageId": 1
      },
      {
        "price": 1280,
        "selected": true,
        "packageId": 2
      },
      {
        "selected": true,
        "packageId": 3,
        "price": 1280
      }
    ],
    "amount": 0,
    "checkbox": false,
    "individual": false
  },
  {
    "id": 64,
    "name": "Virtuální server Power",
    "categoryId": 14,
    "packages": [
      {
        "price": 1890,
        "packageId": 1,
        "selected": true
      },
      {
        "price": 1890,
        "packageId": 2,
        "selected": true
      },
      {
        "selected": true,
        "packageId": 3,
        "price": 1890
      }
    ],
    "amount": 0,
    "checkbox": false,
    "individual": false
  },
  {
    "id": 65,
    "name": "Provoz ABRA BI",
    "categoryId": 14,
    "packages": [
      {
        "selected": false,
        "packageId": 1,
        "price": 0
      },
      {
        "packageId": 2,
        "price": 890,
        "selected": true
      },
      {
        "packageId": 3,
        "selected": true,
        "price": 890
      }
    ],
    "amount": 0,
    "checkbox": false,
    "individual": false
  },
  {
    "id": 66,
    "name": "Automatizační server – paralelní zpracování úloh",
    "categoryId": 14,
    "packages": [
      {
        "packageId": 1,
        "selected": true,
        "price": 1790
      },
      {
        "packageId": 2,
        "selected": true,
        "price": 1790
      },
      {
        "selected": true,
        "packageId": 3,
        "price": 1790
      }
    ],
    "amount": 0,
    "checkbox": false,
    "individual": false
  },
  {
    "id": 67,
    "name": "Využívaná data nad 10 GB",
    "categoryId": 14,
    "packages": [
      {
        "price": 10,
        "selected": true,
        "packageId": 1
      },
      {
        "packageId": 2,
        "selected": true,
        "price": 10
      },
      {
        "selected": true,
        "price": 10,
        "packageId": 3
      }
    ],
    "amount": 0,
    "checkbox": false,
    "individual": false,
    "note": "fakturace dle skutečnosti"
  },
  {
    "id": 68,
    "name": "MS Office",
    "categoryId": 14,
    "packages": [
      {
        "selected": true,
        "packageId": 1,
        "price": 450
      },
      {
        "price": 450,
        "packageId": 2,
        "selected": true
      },
      {
        "price": 450,
        "selected": true,
        "packageId": 3
      }
    ],
    "amount": 0,
    "checkbox": false,
    "individual": false
  },
  {
    "id": 69,
    "name": "Provoz ABRA E-shop",
    "categoryId": 14,
    "packages": [
      {
        "price": 1790,
        "selected": true,
        "packageId": 1
      },
      {
        "selected": true,
        "packageId": 2,
        "price": 1790
      },
      {
        "selected": true,
        "packageId": 3,
        "price": 1790
      }
    ],
    "amount": 0,
    "checkbox": false,
    "individual": false
  },
  {
    "id": 37,
    "name": "Provoz ABN pro zákazníky s databází Firebird",
    "categoryId": 14,
    "packages": [
      {
        "price": 500,
        "selected": true,
        "packageId": 1
      },
      {
        "packageId": 2,
        "selected": true,
        "price": 500
      },
      {
        "packageId": 3,
        "selected": true,
        "price": 500
      }
    ],
    "amount": 0,
    "checkbox": false,
    "individual": false
  },
  {
    "id": 38,
    "name": "Provoz ABN pro zákazníky s databází MS SQL",
    "categoryId": 14,
    "packages": [
      {
        "packageId": 1,
        "price": 1000,
        "selected": true
      },
      {
        "packageId": 2,
        "selected": true,
        "price": 1000
      },
      {
        "selected": true,
        "price": 1000,
        "packageId": 3
      }
    ],
    "amount": 0,
    "checkbox": false,
    "individual": false
  },
  {
    "id": 70,
    "name": "2FA – dvoufaktorová autentizace za uživatele",
    "categoryId": 14,
    "packages": [
      {
        "selected": true,
        "packageId": 1,
        "price": 100
      },
      {
        "price": 100,
        "packageId": 2,
        "selected": true
      },
      {
        "price": 100,
        "packageId": 3,
        "selected": true
      }
    ],
    "amount": 0,
    "checkbox": false,
    "individual": false
  },
  {
    "id": 80,
    "name": "Pohotovost 13x7x4",
    "categoryId": 14,
    "packages": [
      {
        "selected": true,
        "price": 8000,
        "packageId": 1
      },
      {
        "packageId": 2,
        "selected": true,
        "price": 8000
      },
      {
        "selected": true,
        "price": 8000,
        "packageId": 3
      }
    ],
    "amount": 0,
    "checkbox": true,
    "individual": false
  },
  {
    "id": 71,
    "name": "Základní hodinová sazba",
    "categoryId": 15,
    "packages": [
      {
        "packageId": 1,
        "price": 0,
        "selected": true
      },
      {
        "price": 0,
        "selected": true,
        "packageId": 2
      },
      {
        "price": 0,
        "selected": true,
        "packageId": 3
      }
    ],
    "amount": 0,
    "checkbox": false,
    "individual": false
  },
  {
    "id": 95,
    "name": "Doprava",
    "categoryId": 15,
    "packages": [
      {
        "price": 0,
        "packageId": 1,
        "selected": true
      },
      {
        "selected": true,
        "packageId": 2,
        "price": 0
      },
      {
        "packageId": 3,
        "selected": true,
        "price": 0
      }
    ],
    "amount": 0,
    "checkbox": false,
    "individual": false
  },
  {
    "id": 96,
    "name": "Pohotovost k servisnímu zásahu (on-line) v pracovní době",
    "categoryId": 15,
    "packages": [
      {
        "price": 0,
        "selected": true,
        "packageId": 1
      },
      {
        "price": 0,
        "packageId": 2,
        "selected": true
      },
      {
        "packageId": 3,
        "price": 0,
        "selected": true
      }
    ],
    "amount": 0,
    "checkbox": false,
    "individual": false
  },
  {
    "id": 97,
    "name": "Pohotovost k servisnímu zásahu (on-line) mimo pracovní dobu",
    "categoryId": 15,
    "packages": [
      {
        "selected": true,
        "packageId": 1,
        "price": 0
      },
      {
        "price": 0,
        "selected": true,
        "packageId": 2
      },
      {
        "selected": true,
        "price": 0,
        "packageId": 3
      }
    ],
    "amount": 0,
    "checkbox": false,
    "individual": false
  },
  {
    "id": 98,
    "name": "Pravidelný rozvoj – měsíční návštěva",
    "categoryId": 15,
    "packages": [
      {
        "price": 0,
        "packageId": 1,
        "selected": true
      },
      {
        "packageId": 2,
        "selected": true,
        "price": 0
      },
      {
        "selected": true,
        "price": 0,
        "packageId": 3
      }
    ],
    "amount": 0,
    "checkbox": true,
    "individual": false,
    "note": "(v případě realizace v provozovně Zákazníka je k ceně připočítáno dopravné)"
  },
  {
    "id": 99,
    "name": "Pravidelný rozvoj – čtvrtletní návštěva",
    "categoryId": 15,
    "packages": [
      {
        "packageId": 1,
        "selected": true,
        "price": 0
      },
      {
        "price": 0,
        "packageId": 2,
        "selected": true
      },
      {
        "packageId": 3,
        "price": 0,
        "selected": true
      }
    ],
    "amount": 0,
    "checkbox": true,
    "individual": false,
    "note": "(v případě realizace v provozovně Zákazníka je k ceně připočítáno dopravné)"
  },
  {
    "id": 100,
    "name": "Předplacené dny HW specialisty",
    "categoryId": 15,
    "packages": [
      {
        "selected": true,
        "price": 0,
        "packageId": 1
      },
      {
        "selected": true,
        "packageId": 2,
        "price": 0
      },
      {
        "price": 0,
        "packageId": 3,
        "selected": true
      }
    ],
    "amount": 0,
    "checkbox": true,
    "individual": false
  },
  {
    "id": 105,
    "name": "Příplatek za práci mimo pracovní dobu",
    "categoryId": 15,
    "packages": [
      {
        "price": 0,
        "packageId": 1,
        "selected": true
      },
      {
        "selected": true,
        "price": 0,
        "packageId": 2
      },
      {
        "price": 0,
        "selected": true,
        "packageId": 3
      }
    ],
    "amount": 0,
    "checkbox": false,
    "individual": false
  },
  {
    "id": 91,
    "name": "Příplatek za práci v noci a mimo pracovní dny",
    "categoryId": 15,
    "packages": [
      {
        "price": 0,
        "selected": true,
        "packageId": 1
      },
      {
        "selected": true,
        "price": 0,
        "packageId": 2
      },
      {
        "packageId": 3,
        "selected": true,
        "price": 0
      }
    ],
    "amount": 0,
    "checkbox": false,
    "individual": false
  },
  {
    "id": 104,
    "name": "Provoz ABN a BNS v ABRA cloudu bez služby ABRA online)",
    "categoryId": 16,
    "packages": [
      {
        "selected": true,
        "price": 0,
        "packageId": 1
      },
      {
        "price": 0,
        "packageId": 2,
        "selected": true
      },
      {
        "packageId": 3,
        "selected": true,
        "price": 0
      }
    ],
    "amount": 0,
    "checkbox": false,
    "individual": false
  },
  {
    "id": 103,
    "name": "Zákazníkem vytvořená aplikace v ABRA Apps",
    "categoryId": 16,
    "packages": [
      {
        "packageId": 1,
        "price": 0,
        "selected": true
      },
      {
        "price": 0,
        "selected": true,
        "packageId": 2
      },
      {
        "selected": true,
        "packageId": 3,
        "price": 0
      }
    ],
    "amount": 0,
    "checkbox": false,
    "individual": false,
    "note": "Webová aplikace na míru vytvořená v prostředí ABRA Apps."
  },
  {
    "id": 102,
    "name": "ABRA Webhosting",
    "categoryId": 16,
    "packages": [
      {
        "selected": true,
        "packageId": 1,
        "price": 0
      },
      {
        "packageId": 2,
        "selected": true,
        "price": 0
      },
      {
        "price": 0,
        "packageId": 3,
        "selected": true
      }
    ],
    "amount": 0,
    "checkbox": false,
    "individual": true
  },
  {
    "id": 101,
    "name": "Správa domény a Správa domény 3. řádu)",
    "categoryId": 16,
    "packages": [
      {
        "selected": true,
        "price": 0,
        "packageId": 1
      },
      {
        "packageId": 2,
        "selected": true,
        "price": 0
      },
      {
        "price": 0,
        "selected": true,
        "packageId": 3
      }
    ],
    "amount": 0,
    "checkbox": false,
    "individual": true
  },
  {
    "id": 92,
    "name": "Zpracování mezd (mdové účetnictví)",
    "categoryId": 17,
    "packages": [
      {
        "packageId": 1,
        "selected": true,
        "price": 0
      },
      {
        "packageId": 2,
        "price": 0,
        "selected": true
      },
      {
        "packageId": 3,
        "selected": true,
        "price": 0
      }
    ],
    "amount": 0,
    "checkbox": false,
    "individual": true
  },
  {
    "id": 93,
    "name": "Účetní služby",
    "categoryId": 17,
    "packages": [
      {
        "selected": true,
        "packageId": 1,
        "price": 0
      },
      {
        "packageId": 2,
        "price": 0,
        "selected": true
      },
      {
        "price": 0,
        "packageId": 3,
        "selected": true
      }
    ],
    "amount": 0,
    "checkbox": false,
    "individual": true
  },
  {
    "id": 94,
    "name": "Daňové poradenství",
    "categoryId": 17,
    "packages": [
      {
        "price": 0,
        "packageId": 1,
        "selected": true
      },
      {
        "packageId": 2,
        "selected": true,
        "price": 0
      },
      {
        "packageId": 3,
        "price": 0,
        "selected": true
      }
    ],
    "amount": 0,
    "checkbox": false,
    "individual": true
  },
  {
    "id": 95,
    "name": "Ekonomické poradenství",
    "categoryId": 17,
    "packages": [
      {
        "price": 0,
        "packageId": 1,
        "selected": true
      },
      {
        "price": 0,
        "selected": true,
        "packageId": 2
      },
      {
        "selected": true,
        "price": 0,
        "packageId": 3
      }
    ],
    "amount": 0,
    "checkbox": false,
    "individual": false
  }
]