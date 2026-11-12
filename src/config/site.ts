/**
 * ─────────────────────────────────────────────────────────────
 *  KİŞİSEL BİLGİLER — TEK MERKEZ
 *  İsim, iletişim ve sosyal bağlantıları yalnızca burada değiştirin.
 *  Metin içerikleri (hakkımda, projeler, deneyim) → src/content/
 * ─────────────────────────────────────────────────────────────
 */
export const site = {
  /** Marka adı (menü, footer, sekme başlığı). Kişisel isim aşağıda ayrı tutulur. */
  brand: "BT Software",
  firstName: "BEKİR",
  lastName: "TAŞKIN",
  fullName: "Bekir Taşkın",
  initials: "BT",
  role: "Computer Engineer",
  roleSecondary: "Software Developer",
  email: "bkrtskn@gmail.com",
  /** Telefon: ekranda görünen biçim ve tel: bağlantısı için uluslararası biçim. Boşsa gizlenir. */
  phone: { display: "+90 554 498 68 21", href: "+905544986821" },
  location: { city: "Ankara", country: "Türkiye", timeZone: "Europe/Istanbul" },
  /** Açık/kapalı: hero ve iletişimdeki "yeni fırsatlara açık" rozeti */
  openToWork: true,
  socials: {
    github: "https://github.com/bkrtskn-pixel",
    githubHandle: "bkrtskn-pixel",
    /** LinkedIn adresinizi yazın (ör. https://www.linkedin.com/in/kullanici-adi). Boşsa bağlantı gizlenir. */
    linkedin: "",
  },
  /**
   * İletişim formu: Formspree vb. bir uç nokta eklerseniz form oraya gönderir.
   * Boşsa form, ziyaretçinin e-posta uygulamasını doldurulmuş mesajla açar.
   */
  formEndpoint: "",
  year: 2026,
} as const;

export type Site = typeof site;
