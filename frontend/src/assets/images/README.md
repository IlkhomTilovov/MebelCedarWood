# Image assets

Haqiqiy fotosuratlar tayyor bo'lganda shu joylashuvga qo'ying:

- `hero/` — bosh sahifa hero fon suratlari (1 dona, keng kadr, 16:9 yoki kengroq)
- `about/` — ishlab chiqarish ustaxonasi / jarayon suratlari
- `portfolio/` — tayyor loyihalar suratlari (har bir loyiha uchun 1+ surat)

Keyin tegishli komponentda `<ImagePlaceholder src={import('./assets/images/.../file.jpg')} ... />`
tarzida `src` prop beriladi — boshqa hech narsa o'zgartirilmaydi, chunki
`ImagePlaceholder` `src` berilganda avtomatik haqiqiy rasmga o'tadi va
berilmaganda joriy premium placeholder teksturasini ko'rsatadi.
