export const itemsSettings = [
    {
      id: 1,
      name: "Počet uživatelů s plným přístupem",
      categoryId: 1,
      note: "Pojmenovaní uživatelé (ne konkurenční)",
      prices: [
        { packageId: 1, value: 5, selected: true },
        { packageId: 2, value: 20, selected: true },
        { packageId: 3, value: 9999, selected: true }
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
        { packageId: 1, value: 0, selected: false },
        { packageId: 2, value: 2, selected: true },
        { packageId: 3, value: 5, selected: true }
      ]
    },
  ]