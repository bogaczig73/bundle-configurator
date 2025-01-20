                            <div className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                checked={getItemSelected(item, bundle.id)}
                                onChange={() => onItemToggle(bundle.id, item.id)}
                                className={tableStyles.checkbox}
                              />
                              <div className="flex gap-2">
                                <input
                                  type="number"
                                  value={getItemPrice(item, bundle.id)}
                                  onChange={(e) => onItemPriceChange(bundle.id, item.id, e.target.value)}
                                  className={tableStyles.numberInput}
                                />
                                <input
                                  type="number"
                                  value={getItemDiscountedAmount(item, bundle.id)}
                                  onChange={(e) => onItemDiscountChange(bundle.id, item.id, e.target.value)}
                                  className={tableStyles.numberInput}
                                />
                              </div>
                            </div>
                            {item.packages?.find(p => p.packageId === bundle.id)?.note && (
                              <div className="text-xs text-gray-500 mt-1 px-2 py-1 bg-gray-50 rounded border border-gray-200 max-w-[200px] truncate hover:whitespace-normal hover:text-clip">
                                {item.packages?.find(p => p.packageId === bundle.id)?.note}
                              </div>
                            )} 