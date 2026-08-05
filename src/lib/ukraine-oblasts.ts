/** Ukrainian oblasts — used for service-area region selection in admin. */
export const UKRAINE_OBLASTS = [
  { id: 'vinnytsia', label: 'Вінницька область', aliases: ['vinnytsia oblast', 'вінницька'] },
  { id: 'volyn', label: 'Волинська область', aliases: ['volyn oblast', 'волинська'] },
  { id: 'dnipropetrovsk', label: 'Дніпропетровська область', aliases: ['dnipropetrovsk oblast', 'дніпропетровська'] },
  { id: 'donetsk', label: 'Донецька область', aliases: ['donetsk oblast', 'донецька'] },
  { id: 'zhytomyr', label: 'Житомирська область', aliases: ['zhytomyr oblast', 'житомирська'] },
  { id: 'zakarpattia', label: 'Закарпатська область', aliases: ['zakarpattia oblast', 'закарпатська'] },
  { id: 'zaporizhzhia', label: 'Запорізька область', aliases: ['zaporizhzhia oblast', 'zaporizhzhia'] },
  { id: 'ivanofrankivsk', label: 'Івано-Франківська область', aliases: ['ivano-frankivsk oblast', 'івано-франківська'] },
  { id: 'kyiv-oblast', label: 'Київська область', aliases: ['kyiv oblast', 'київська область'] },
  { id: 'kirovohrad', label: 'Кіровоградська область', aliases: ['kirovohrad oblast', 'кіровоградська'] },
  { id: 'luhansk', label: 'Луганська область', aliases: ['luhansk oblast', 'луганська'] },
  { id: 'lviv', label: 'Львівська область', aliases: ['lviv oblast', 'львівська'] },
  { id: 'mykolaiv', label: 'Миколаївська область', aliases: ['mykolaiv oblast', 'миколаївська'] },
  { id: 'odesa', label: 'Одеська область', aliases: ['odesa oblast', 'одеська'] },
  { id: 'poltava', label: 'Полтавська область', aliases: ['poltava oblast', 'полтавська'] },
  { id: 'rivne', label: 'Рівненська область', aliases: ['rivne oblast', 'рівненська'] },
  { id: 'sumy', label: 'Сумська область', aliases: ['sumy oblast', 'сумська'] },
  { id: 'ternopil', label: 'Тернопільська область', aliases: ['ternopil oblast', 'тернопільська'] },
  { id: 'kharkiv', label: 'Харківська область', aliases: ['kharkiv oblast', 'харківська'] },
  { id: 'kherson', label: 'Херсонська область', aliases: ['kherson oblast', 'херсонська'] },
  { id: 'khmelnytskyi', label: 'Хмельницька область', aliases: ['khmelnytskyi oblast', 'хмельницька'] },
  { id: 'cherkasy', label: 'Черкаська область', aliases: ['cherkasy oblast', 'черкаська'] },
  { id: 'chernivtsi', label: 'Чернівецька область', aliases: ['chernivtsi oblast', 'чернівецька'] },
  { id: 'chernihiv', label: 'Чернігівська область', aliases: ['chernihiv oblast', 'чернігівська'] },
  { id: 'kyiv-city', label: 'м. Київ', aliases: ['kyiv', 'київ'] },
] as const;

export function oblastLabelsForIds(ids: string[]): string[] {
  const set = new Set(ids);
  return UKRAINE_OBLASTS.filter((o) => set.has(o.id)).flatMap((o) => [o.label, ...o.aliases]);
}

export function oblastIdsFromRegions(regions: string[]): string[] {
  const normalized = regions.map((r) => r.trim().toLowerCase());
  return UKRAINE_OBLASTS.filter((o) =>
    normalized.some(
      (r) =>
        o.label.toLowerCase() === r ||
        o.aliases.some((a) => a.toLowerCase() === r) ||
        r.includes(o.label.toLowerCase().replace(' область', '')),
    ),
  ).map((o) => o.id);
}
