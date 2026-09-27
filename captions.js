/* ─────────────────────────────────────────────────────────────
   ALTYAZILAR / CAPTIONS — düzenlenebilir.
   Kısa, tek fikir, 7. sınıf dili. start/end saniye cinsinden.
   note: öğretmen için önerilen seslendirme cümlesi.
   ───────────────────────────────────────────────────────────── */
(function (root) {
  const CAPTIONS = [
    { scene: 1, start: 4.4, end: 10.2, tr: 'Kaç m² çim, kaç kg tohum?', en: 'How much grass, how much seed?',
      note: 'Bahçe bir dik yamuk: tabanları 20 ve 12 metre, yüksekliği 10 metre. Ortada yarıçapı 3 metre olan bir havuz, köşede yarıçapı 4 metre olan çeyrek daire bir çiçeklik var. Kalan yere çim ekilecek. 40 metrekare için 1 kilogram tohum gerekiyor.' },
    { scene: 2, start: 10.8, end: 21.0, tr: 'Bileşenler', en: 'The components',
      note: 'Bileşenleri belirleyelim: bahçe bir yamuk, havuz bir daire, çiçeklik 90 derecelik bir daire dilimi. Çim, bahçeden havuz ve çiçeklik çıkınca kalan yer.' },
    { scene: 2, start: 21.2, end: 27.8, tr: 'Tahmin: yaklaşık 120 m²', en: 'Estimate: about 120 m²',
      note: 'Önce tahmin edelim: bahçe yaklaşık 160, havuz yaklaşık 27, çiçeklik yaklaşık 12. Çim yaklaşık 120 metrekare.' },
    { scene: 3, start: 28.8, end: 36.4, tr: 'Dikdörtgen değil, yamuk', en: 'Not a rectangle, a trapezoid',
      note: '20 çarpı 10 alırsak bahçeyi dikdörtgen saymış oluruz: bu strateji yanlış. Yamuk bağıntısı: 20 artı 12 bölü 2 çarpı 10, 160 metrekare.' },
    { scene: 3, start: 36.6, end: 45.8, tr: 'Kontrol: 120 + 40 = 160', en: 'Check: 120 + 40 = 160',
      note: 'Başka yolla kontrol edelim: bahçeyi bir dikdörtgen ve bir üçgene ayıralım. 120 artı 40, yine 160.' },
    { scene: 4, start: 46.8, end: 55.0, tr: 'Havuz ve çiçeklik', en: 'The pool and the flowerbed',
      note: 'Havuz 3,14 çarpı 9, 28,26 metrekare. Çiçeklik 3,14 çarpı 16 çarpı 90 bölü 360, 12,56 metrekare.' },
    { scene: 4, start: 55.2, end: 63.8, tr: '119,18 m² çim, 3 kg tohum', en: '119.18 m² of grass, 3 kg of seed',
      note: 'Çim: 160 eksi 28,26 eksi 12,56, 119,18 metrekare. Tahminimize yakın. 40 metrekare için 1 kilogramdan yaklaşık 3 kilogram tohum gerekir.' },
    { scene: 5, start: 64.8, end: 73.4, tr: 'Yeni bahçe', en: 'A new garden',
      note: 'Aynı stratejiyi yeni bir bahçede deneyelim: 10 metrelik kare, yarım daire çiçeklik ve köşegenleri 4 ve 3 metre olan eşkenar dörtgen havuz.' },
    { scene: 5, start: 73.6, end: 79.8, tr: 'Çim: 54,75 m²', en: 'Grass: 54.75 m²',
      note: 'Çim: 100 eksi 39,25 eksi 6, 54,75 metrekare. Bütünden içteki şekilleri çıkarmak her planda işliyor.' },
    { scene: 6, start: 80.6, end: 86.4, tr: 'Belirle, tahmin et, kontrol et', en: 'Identify, estimate, check',
      note: 'Aklında kalsın: bileşenleri belirle, tahmin et, hesapla ve kontrol et; işe yaramayan stratejiyi değiştir.' },
    { scene: 6, start: 86.8, end: 91.0, tr: 'Bütün − içteki şekiller', en: 'The whole minus the parts inside',
      note: 'Kalan alan: bütün eksi içteki şekiller!' },
  ];
  if (typeof module !== 'undefined' && module.exports) module.exports = CAPTIONS;
  else { root.LI = root.LI || {}; root.LI.CAPTIONS = CAPTIONS; }
})(typeof window !== 'undefined' ? window : globalThis);
