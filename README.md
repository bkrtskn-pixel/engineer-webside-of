# Bekir Taşkın — Portfolyo

Bilgisayar mühendisi / yazılım geliştirici kişisel portfolyo sitesi.

**Canlı:** https://bkrtskn-pixel.github.io/engineer-webside-of/

## Teknolojiler
Next.js (App Router, statik export) · TypeScript · Tailwind CSS v4 · Framer Motion · Lucide

## Bilgileri güncelleme
| Ne | Nerede |
|---|---|
| İsim, unvan, e-posta, GitHub, **LinkedIn**, konum | `src/config/site.ts` |
| Metinler (TR) | `src/content/tr.ts` |
| Metinler (EN) | `src/content/en.ts` |
| Projeler / deneyim | aynı dosyalarda `projects.items` ve `experience.items` |
| Renkler ve fontlar | `src/app/globals.css` → `@theme` |

- Deneyim kayıtlarında `placeholder: false` yapınca "örnek içerik" rozeti kalkar.
- Projelerde `status: "concept"` olan kartlarda "Örnek / Konsept" rozeti gösterilir. `repo` alanına depo adresi yazılırsa GitHub düğmesi oraya gider.
- İletişim formu varsayılan olarak e-posta uygulamasını açar; Formspree gibi bir servis kullanmak için `site.formEndpoint` alanını doldurun.

## Yerelde çalıştırma
```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # statik çıktı → out/
```

## Yayın
`main` dalına her push'ta GitHub Actions siteyi derler ve `gh-pages` dalına yayınlar
(`.github/workflows/deploy.yml`). Pages ayarı: *Deploy from a branch → gh-pages / root*.

## Yapı
```
src/
  app/              sayfalar, layout, SEO (sitemap, robots), sayfa geçişi (template.tsx)
  components/
    sections/       Hero, About, Skills, Projects, Experience, Contact
    projects/       ProjectCard, ProjectCover (kodla çizilmiş kapaklar), ProjectDetail
    ui/             Button, Reveal, Cursor, Marquee, SpotlightCard, Badge…
  config/site.ts    kişisel bilgiler (tek merkez)
  content/          TR/EN içerik + tipler
  lib/              dil & giriş durumu, animasyon sabitleri, hook'lar
```
