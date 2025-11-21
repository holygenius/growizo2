export const blogPosts = [
  {
    id: 1,
    slug: {
      en: "understanding-ppfd-key-to-massive-yields",
      tr: "ppfd-anlamak-buyuk-verimler-icin-anahtar"
    },
    title: {
      en: "Understanding PPFD: The Key to Massive Yields",
      tr: "PPFD'yi Anlamak: Büyük Verimler İçin Anahtar"
    },
    excerpt: {
      en: "Why lumens don't matter and how to measure the light your plants actually use for photosynthesis.",
      tr: "Lümenlerin neden önemli olmadığını ve bitkilerinizin fotosentez için gerçekten kullandığı ışığı nasıl ölçeceğinizi öğrenin."
    },
    category: "Lighting",
    content: {
      en: `
        <p>When it comes to indoor growing, light is your most important variable. But not all light is created equal. Many beginners make the mistake of judging grow lights by their wattage or lumen output, but plants see light differently than humans do.</p>
        
        <h3>What is PPFD?</h3>
        <p><strong>Photosynthetic Photon Flux Density (PPFD)</strong> measures the amount of light (photons) that actually reaches your plant's canopy each second. It's measured in micromoles per square meter per second (μmol/m²/s).</p>
        
        <h3>Optimal Levels</h3>
        <ul>
          <li><strong>Seedlings:</strong> 200-400 μmol/m²/s</li>
          <li><strong>Vegetative:</strong> 400-600 μmol/m²/s</li>
          <li><strong>Flowering:</strong> 600-1000+ μmol/m²/s</li>
        </ul>
        
        <p>Using our <strong>Grow Wizard PPFD Simulator</strong>, you can visualize exactly how your light fixture performs in your specific tent size, ensuring you don't have any "hot spots" that burn plants or "dead zones" where growth stalls.</p>
      `,
      tr: `
        <p>Kapalı alanda yetiştiricilik söz konusu olduğunda, ışık en önemli değişkeninizdir. Ancak tüm ışıklar eşit yaratılmamıştır. Birçok yeni başlayan, büyüme ışıklarını watt veya lümen çıktısına göre değerlendirme hatası yapar, ancak bitkiler ışığı insanlardan farklı görür.</p>
        
        <h3>PPFD Nedir?</h3>
        <p><strong>Fotosentetik Foton Akı Yoğunluğu (PPFD)</strong>, her saniye bitkinizin tepesine ulaşan ışık (foton) miktarını ölçer. Mikromol/metrekare/saniye (μmol/m²/s) cinsinden ölçülür.</p>
        
        <h3>Optimum Seviyeler</h3>
        <ul>
          <li><strong>Fideler:</strong> 200-400 μmol/m²/s</li>
          <li><strong>Vejetatif:</strong> 400-600 μmol/m²/s</li>
          <li><strong>Çiçeklenme:</strong> 600-1000+ μmol/m²/s</li>
        </ul>
        
        <p><strong>Grow Wizard PPFD Simülatörü</strong>müzü kullanarak, ışık armatürünüzün belirli çadır boyutunuzda tam olarak nasıl performans gösterdiğini görselleştirebilir, bitkileri yakan "sıcak noktalar" veya büyümenin durduğu "ölü bölgeler" olmadığından emin olabilirsiniz.</p>
      `
    },
    author: "Dr. Green",
    date: "October 15, 2025",
    readTime: "5 min read",
    image: "https://images.unsplash.com/photo-1550989460-0adf9ea622e2?q=80&w=800&auto=format&fit=crop",
    tags: ["Lighting", "Science", "Guides"],
    quiz: [
      {
        question: {
          en: "What is the optimal PPFD range for the flowering stage?",
          tr: "Çiçeklenme aşaması için optimum PPFD aralığı nedir?"
        },
        options: {
          en: [
            "200-400 μmol/m²/s",
            "400-600 μmol/m²/s",
            "600-1000+ μmol/m²/s",
            "100-200 μmol/m²/s"
          ],
          tr: [
            "200-400 μmol/m²/s",
            "400-600 μmol/m²/s",
            "600-1000+ μmol/m²/s",
            "100-200 μmol/m²/s"
          ]
        },
        correctAnswer: 2,
        explanation: {
          en: "Flowering plants need intense light energy to produce dense buds, typically requiring 600-1000+ μmol/m²/s.",
          tr: "Çiçeklenme bitkileri yoğun tomurcuklar üretmek için yoğun ışık enerjisine ihtiyaç duyar ve genellikle 600-1000+ μmol/m²/s gerektirir."
        }
      },
      {
        question: {
          en: "What does PPFD measure?",
          tr: "PPFD neyi ölçer?"
        },
        options: {
          en: [
            "Total light output of a bulb",
            "Light intensity visible to humans",
            "Light reaching the canopy used for photosynthesis",
            "Heat emitted by the light"
          ],
          tr: [
            "Bir ampulün toplam ışık çıktısı",
            "İnsanlara görünen ışık yoğunluğu",
            "Fotosentez için kullanılan kanopiye ulaşan ışık",
            "Işığın yaydığı ısı"
          ]
        },
        correctAnswer: 2,
        explanation: {
          en: "PPFD measures the specific photons that land on the plant canopy and drive photosynthesis.",
          tr: "PPFD, bitki tepesine inen ve fotosentezi yönlendiren belirli fotonları ölçer."
        }
      },
      {
        question: {
          en: "Why are lumens not a good metric for grow lights?",
          tr: "Lümenler neden büyüme ışıkları için iyi bir ölçüt değildir?"
        },
        options: {
          en: [
            "They are too hard to measure",
            "They measure light based on human vision, not plant needs",
            "They are only for incandescent bulbs",
            "They are always inaccurate"
          ],
          tr: [
            "Ölçülmesi çok zordur",
            "İnsan görüşüne göre ışığı ölçer, bitki ihtiyaçlarına göre değil",
            "Sadece akkor ampuller için geçerlidir",
            "Her zaman yanlış"
          ]
        },
        correctAnswer: 1,
        explanation: {
          en: "Lumens are weighted to human sensitivity (green/yellow light), while plants use mostly red and blue light.",
          tr: "Lümenler, insan duyarlılığına (yeşil/sarı ışık) göre ağırlıklandırılmıştır, oysa bitkiler çoğunlukla kırmızı ve mavi ışık kullanır."
        }
      }
    ]
  },
  {
    id: 2,
    slug: {
      en: "hydroponics-vs-soil-which-is-right",
      tr: "hidroponik-vs-toprak-hangisi-dogru"
    },
    title: {
      en: "Hydroponics vs. Soil: Which is Right for You?",
      tr: "Hidroponik Mi, Toprak mı: Hangisi Sizin İçin Uygun?"
    },
    excerpt: {
      en: "A deep dive into the pros and cons of soil-less growing compared to traditional methods.",
      tr: "Topraksız yetiştiriciliğin geleneksel yöntemlerle karşılaştırıldığında artılarını ve eksilerini derinlemesine inceleyin."
    },
    category: "Hydroponics",
    content: {
      en: `
        <p>The age-old debate: nature's way or the high-tech way? Both soil and hydroponic systems have their place in the modern grower's toolkit, but choosing the right one depends on your goals, budget, and experience level.</p>
        
        <h3>Soil Growing</h3>
        <p>Soil is forgiving. It buffers pH fluctuations and holds nutrients, giving you a safety net if you miss a feeding. It's often said to produce a more complex terpene profile, though yields may be slightly lower than hydro.</p>
        
        <h3>Hydroponics</h3>
        <p>Hydroponics is about speed and precision. By delivering nutrients directly to the roots in a highly oxygenated solution, plants can grow up to <strong>20-30% faster</strong>. However, things can go wrong quickly if a pump fails or pH drifts.</p>
        
        <blockquote>"Hydroponics is like driving a Formula 1 car; Soil is like driving a reliable pickup truck. Both get you there, but one requires a lot more attention."</blockquote>
      `,
      tr: `
        <p>Asırlık tartışma: doğanın yolu mu yoksa yüksek teknoloji mi? Hem toprak hem de hidroponik sistemlerin modern yetiştiricinin araç setinde bir yeri var, ancak doğru olanı seçmek hedeflerinize, bütçenize ve deneyim seviyenize bağlı.</p>
        
        <h3>Toprakta Yetiştirme</h3>
        <p>Toprak affedicidir. pH dalgalanmalarını tamponlar ve besin maddelerini tutar, bu da bir besin zamanlamasını kaçırırsanız size bir güvenlik ağı sağlar. Genellikle daha karmaşık bir terpen profili ürettiği söylenir, ancak verimler hidroponikten biraz daha düşük olabilir.</p>
        
        <h3>Hidroponik</h3>
        <p>Hidroponik, hız ve hassasiyetle ilgilidir. Besinleri doğrudan köklere, yüksek oranda oksijenlenmiş bir çözeltide ileterek, bitkiler <strong>%20-30 daha hızlı</strong> büyüyebilir. Ancak, bir pompa arızalanırsa veya pH kayarsa işler hızla ters gidebilir.</p>
        
        <blockquote>"Hidroponik, bir Formula 1 arabası sürmek gibidir; Toprak, güvenilir bir kamyonet sürmek gibidir. İkisi de sizi oraya götürür, ama biri çok daha fazla dikkat gerektirir."</blockquote>
      `
    },
    author: "Alex Flora",
    date: "October 22, 2025",
    readTime: "8 min read",
    image: "https://images.unsplash.com/photo-1556559322-b5071efadc88?q=80&w=800&auto=format&fit=crop",
    tags: ["Hydroponics", "Soil", "Basics"],
    quiz: [
      {
        question: {
          en: "Which growing method typically results in faster growth rates?",
          tr: "Hangi yetiştirme yöntemi genellikle daha hızlı büyüme oranlarıyla sonuçlanır?"
        },
        options: {
          en: [
            "Soil",
            "Hydroponics",
            "Both are the same",
            "Aeroponics only"
          ],
          tr: [
            "Toprak",
            "Hidroponik",
            "Her ikisi aynı",
            "Sadece Aeroponik"
          ]
        },
        correctAnswer: 1,
        explanation: {
          en: "Hydroponics delivers nutrients directly to the roots with high oxygen, allowing for 20-30% faster growth.",
          tr: "Hidroponik, besinleri köklere doğrudan yüksek oksijenle ileterek %20-30 daha hızlı büyümeye olanak tanır."
        }
      },
      {
        question: {
          en: "What is a main advantage of soil growing?",
          tr: "Toprakta yetiştirmenin ana avantajı nedir?"
        },
        options: {
          en: [
            "It requires no nutrients",
            "It is faster than hydro",
            "It buffers pH and is more forgiving",
            "It uses no water"
          ],
          tr: [
            "Besin gerektirmez",
            "Hidrodan daha hızlıdır",
            "pH'ı tamponlar ve daha affedicidir",
            "Hiç su kullanmaz"
          ]
        },
        correctAnswer: 2,
        explanation: {
          en: "Soil acts as a buffer for pH and nutrients, making it more forgiving of mistakes than hydroponics.",
          tr: "Toprak, pH ve besinler için bir tampon görevi görerek, hidroponikten daha affedici hale getirir."
        }
      },
      {
        question: {
          en: "What is a risk of hydroponics?",
          tr: "Hidroponiğin bir riski nedir?"
        },
        options: {
          en: [
            "Plants grow too slow",
            "System failures can damage plants quickly",
            "It attracts more pests",
            "It requires sunlight"
          ],
          tr: [
            "Bitkiler çok yavaş büyür",
            "Sistem arızaları bitkilere hızla zarar verebilir",
            "Daha fazla zararlı çeker",
            "Güneş ışığı gerektirir"
          ]
        },
        correctAnswer: 1,
        explanation: {
          en: "Because roots are exposed or in water, a pump failure or pH spike can damage plants very rapidly.",
          tr: "Kökler suya maruz kaldığı veya suda olduğu için, bir pompa arızası veya pH dalgalanması bitkilere çok hızlı zarar verebilir."
        }
      }
    ]
  },
  {
    id: 3,
    slug: {
      en: "automating-your-grow-tent",
      tr: "buyume-cadirinizi-otomatiklestirmek"
    },
    title: {
      en: "Automating Your Grow Tent",
      tr: "Büyüme Çadırınızı Otomatikleştirmek"
    },
    excerpt: {
      en: "How to use smart plugs, sensors, and controllers to put your garden on autopilot.",
      tr: "Bahçenizi otomatik pilota almak için akıllı prizler, sensörler ve kontrolörler nasıl kullanılır."
    },
    category: "Automation",
    content: {
      en: `
        <p>Gone are the days of manually turning lights on and off. Modern grow technology allows you to monitor and control your environment from your smartphone, ensuring consistency that leads to top-shelf results.</p>
        
        <h3>Essential Automation</h3>
        <ol>
          <li><strong>Light Timers:</strong> The absolute bare minimum. Consistency is key for photoperiod plants.</li>
          <li><strong>Climate Controllers:</strong> Devices that trigger exhaust fans when temperature or humidity gets too high.</li>
          <li><strong>pH Monitors:</strong> Continuous monitoring of your reservoir's pH and EC levels.</li>
        </ol>
        
        <p>Automation doesn't just save time; it creates a stable environment that plants love. Less fluctuation means less stress, and less stress means bigger fruits and flowers.</p>
      `,
      tr: `
        <p>Işıkları manuel olarak açıp kapama günleri geride kaldı. Modern yetiştirme teknolojisi, ortamınızı akıllı telefonunuzdan izleyip kontrol etmenizi sağlar ve bu da üst düzey sonuçlara yol açan tutarlılığı garanti eder.</p>
        
        <h3>Temel Otomasyon</h3>
        <ol>
          <li><strong>Işık Zamanlayıcıları:</strong> Kesinlikle gerekli olanlar. Tutarlılık, fotoperiyodik bitkiler için anahtardır.</li>
          <li><strong>Iklim Kontrol Cihazları:</strong> Sıcaklık veya nem çok yükseldiğinde egzoz fanlarını devreye sokan cihazlar.</li>
          <li><strong>pH Monitörleri:</strong> Rezervuarınızdaki pH ve EC seviyelerinin sürekli izlenmesi.</li>
        </ol>
        
        <p>Otomasyon sadece zaman kazandırmakla kalmaz; aynı zamanda bitkilerin sevdiği stabil bir ortam yaratır. Daha az dalgalanma, daha az stres anlamına gelir ve daha az stres, daha büyük meyveler ve çiçekler demektir.</p>
      `
    },
    author: "Tech Grower",
    date: "November 01, 2025",
    readTime: "6 min read",
    image: "/images/blog-automation.png",
    tags: ["Automation", "Tech", "Smart Grow"],
    quiz: [
      {
        question: {
          en: "What is considered the 'absolute bare minimum' for automation?",
          tr: "Otomasyon için 'kesinlikle gerekli olanlar' nelerdir?"
        },
        options: {
          en: [
            "pH Monitor",
            "Climate Controller",
            "Light Timer",
            "Automatic Watering"
          ],
          tr: [
            "pH Monitörü",
            "İklim Kontrol Cihazı",
            "Işık Zamanlayıcı",
            "Otomatik Sulama"
          ]
        },
        correctAnswer: 2,
        explanation: {
          en: "Light timers are essential because consistent light cycles are critical for plant health and photoperiod regulation.",
          tr: "Işık zamanlayıcıları, tutarlı ışık döngülerinin bitki sağlığı ve fotoperiyot düzenlemesi için kritik öneme sahip olduğu için gereklidir."
        }
      },
      {
        question: {
          en: "Why is environmental consistency important?",
          tr: "Çevresel tutarlılık neden önemlidir?"
        },
        options: {
          en: [
            "It saves electricity",
            "It reduces plant stress",
            "It looks cool",
            "It is required by law"
          ],
          tr: [
            "Elektrik tasarrufu sağlar",
            "Bitkilerde stresi azaltır",
            "Havalı görünür",
            "Kanunen gereklidir"
          ]
        },
        correctAnswer: 1,
        explanation: {
          en: "Stable environments reduce stress on plants, allowing them to focus energy on growth and flower production.",
          tr: "Stabil ortamlar, bitkiler üzerindeki stresi azaltır ve onların enerji odaklanmalarını sağlar. Bu da büyüme ve çiçek üretimini artırır."
        }
      },
      {
        question: {
          en: "What does a climate controller typically control?",
          tr: "Bir iklim kontrol cihazı genellikle neyi kontrol eder?"
        },
        options: {
          en: [
            "Nutrient levels",
            "Exhaust fans and humidifiers",
            "Light spectrum",
            "Water temperature"
          ],
          tr: [
            "Besin seviyeleri",
            "Egzoz fanları ve nemlendiriciler",
            "Işık spektrumu",
            "Su sıcaklığı"
          ]
        },
        correctAnswer: 1,
        explanation: {
          en: "Climate controllers manage temperature and humidity by turning exhaust fans, humidifiers, or heaters on and off.",
          tr: "İklim kontrol cihazları, egzoz fanlarını, nemlendiricileri veya ısıtıcıları açıp kapatarak sıcaklık ve nemi yönetir."
        }
      }
    ]
  },
  {
    id: 4,
    slug: {
      en: "vpd-secret-to-perfect-transpiration",
      tr: "vpd-mukemmel-transpirasyonun-sirri"
    },
    title: {
      en: "VPD: The Secret to Perfect Transpiration",
      tr: "VPD: Mükemmel Transpirasyonun Sırrı"
    },
    excerpt: {
      en: "Vapor Pressure Deficit explained simply. Master this metric to optimize nutrient uptake.",
      tr: "Buhar Basıncı Açığı basitçe açıklandı. Besin alımını optimize etmek için bu metriği ustalaşın."
    },
    category: "Environment",
    content: {
      en: `
        <p>Vapor Pressure Deficit (VPD) is the difference between the amount of moisture in the air and how much moisture the air can hold at saturation. It's the driving force behind transpiration—how plants move water and nutrients from roots to leaves.</p>
        
        <h3>Why VPD Matters</h3>
        <p>If VPD is too low (air is too humid), plants can't transpire, leading to mold and nutrient lockout. If VPD is too high (air is too dry), plants close their stomata to save water, halting photosynthesis.</p>
        
        <p>Aim for a VPD of <strong>0.8-1.1 kPa</strong> in veg and <strong>1.2-1.5 kPa</strong> in flower for optimal results.</p>
      `,
      tr: `
        <p>Buhar Basıncı Açığı (VPD), havadaki nem miktarı ile havanın doygunlukta tutabileceği nem miktarı arasındaki farktır. Bu, transpirasyonun arkasındaki itici güçtür - bitkilerin köklerden yapraklara su ve besin maddelerini nasıl taşıdığıdır.</p>
        
        <h3>Neden VPD Önemlidir</h3>
        <p>VPD çok düşükse (hava çok nemliysa), bitkiler transpirasyon yapamaz, bu da küf ve besin kilitlenmesine yol açar. VPD çok yüksekse (hava çok kuruysa), bitkiler su tasarrufu yapmak için stomalarını kapatır, fotosentezi durdurur.</p>
        
        <p>Optimal sonuçlar için vejetatif dönemde <strong>0.8-1.1 kPa</strong> ve çiçeklenme döneminde <strong>1.2-1.5 kPa</strong> VPD hedefleyin.</p>
      `
    },
    author: "Dr. Green",
    date: "November 10, 2025",
    readTime: "7 min read",
    image: "https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?q=80&w=800&auto=format&fit=crop",
    tags: ["Advanced", "Environment", "Science"],
    quiz: [
      {
        question: {
          en: "What happens if VPD is too low (air is too humid)?",
          tr: "VPD çok düşükse (hava çok nemliysa) ne olur?"
        },
        options: {
          en: [
            "Plants dry out",
            "Photosynthesis speeds up",
            "Plants can't transpire efficiently",
            "Nutrient uptake increases"
          ],
          tr: [
            "Bitkiler kurur",
            "Fotosentez hızlanır",
            "Bitkiler verimli şekilde transpirasyon yapamaz",
            "Besin alımı artar"
          ]
        },
        correctAnswer: 2,
        explanation: {
          en: "Low VPD means the air is saturated, making it difficult for plants to release water vapor (transpire), which slows nutrient transport.",
          tr: "Düşük VPD, havanın doygun olduğu anlamına gelir, bu da bitkilerin su buharını (transpirasyon) serbest bırakmasını zorlaştırır ve bu da besin maddelerinin taşınmasını yavaşlatır."
        }
      },
      {
        question: {
          en: "What is the recommended VPD range for the vegetative stage?",
          tr: "Vejetatif dönem için önerilen VPD aralığı nedir?"
        },
        options: {
          en: [
            "0.4-0.8 kPa",
            "0.8-1.1 kPa",
            "1.2-1.5 kPa",
            "1.5-2.0 kPa"
          ],
          tr: [
            "0.4-0.8 kPa",
            "0.8-1.1 kPa",
            "1.2-1.5 kPa",
            "1.5-2.0 kPa"
          ]
        },
        correctAnswer: 1,
        explanation: {
          en: "A VPD of 0.8-1.1 kPa is ideal for vegetative growth, balancing transpiration rates with humidity.",
          tr: "0.8-1.1 kPa'lık bir VPD, vejetatif büyüme için idealdir ve transpirasyon oranları ile nem arasında bir denge sağlar."
        }
      },
      {
        question: {
          en: "What drives transpiration in plants?",
          tr: "Bitkilerde transpirasyonu ne tetikler?"
        },
        options: {
          en: [
            "Wind speed",
            "Vapor Pressure Deficit (VPD)",
            "Soil pH",
            "Root size"
          ],
          tr: [
            "Rüzgar hızı",
            "Buhar Basıncı Açığı (VPD)",
            "Toprak pH'ı",
            "Kök boyutu"
          ]
        },
        correctAnswer: 1,
        explanation: {
          en: "VPD is the pressure difference that pulls water up from the roots and out through the leaves.",
          tr: "VPD, suyu köklerden çekip yapraklar aracılığıyla dışarı atan basınç farkıdır."
        }
      }
    ]
  },
  {
    id: 5,
    slug: {
      en: "training-techniques-lst-vs-hst",
      tr: "egitim-teknikleri-lst-vs-hst"
    },
    title: {
      en: "Training Techniques: LST vs. HST",
      tr: "Eğitim Teknikleri: LST ve HST"
    },
    excerpt: {
      en: "Maximize your canopy and yields by training your plants. Learn the difference between Low and High Stress Training.",
      tr: "Bitkilerinizi eğiterek kanopi ve verimlerinizi maksimize edin. Düşük ve Yüksek Stres Eğitimi arasındaki farkı öğrenin."
    },
    category: "Training",
    content: {
      en: `
        <p>Plant training is the art of manipulating your plant's shape to expose more bud sites to light. In a grow tent, vertical space is limited, so training is essential for keeping plants short and wide.</p>
        
        <h3>Low Stress Training (LST)</h3>
        <p>LST involves gently bending and tying down stems to create an even canopy. It's safe, easy, and doesn't slow down growth. It's perfect for autoflowers or beginners.</p>
        
        <h3>High Stress Training (HST)</h3>
        <p>HST includes techniques like <strong>Topping</strong> (cutting the main tip) and <strong>Super Cropping</strong> (crushing the stem). These methods are traumatic but can dramatically increase yields by forcing the plant to build a stronger structure. HST requires a recovery period.</p>
      `,
      tr: `
        <p>Bitki eğitimi, bitkinizin şeklini manipüle ederek daha fazla tomurcuğun ışığa maruz kalmasını sağlama sanatıdır. Bir büyüme çadırında, dikey alan sınırlıdır, bu nedenle bitkileri kısa ve geniş tutmak için eğitim şarttır.</p>
        
        <h3>Düşük Stres Eğitimi (LST)</h3>
        <p>LST, gövdeyi nazikçe bükmeyi ve aşağıya bağlamayı içerir, böylece eşit bir kanopi oluşturulur. Güvenli, kolaydır ve büyümeyi yavaşlatmaz. Otomatik çiçekler veya yeni başlayanlar için mükemmeldir.</p>
        
        <h3>Yüksek Stres Eğitimi (HST)</h3>
        <p>HST, ana ucu kesmeyi (<strong>Topping</strong>) ve gövdeyi ezmeyi (<strong>Super Cropping</strong>) gibi teknikleri içerir. Bu yöntemler travmatik olabilir, ancak bitkinin daha güçlü bir yapı inşa etmesini zorlayarak verimleri dramatik şekilde artırabilir. HST, bir iyileşme süresi gerektirir.</p>
      `
    },
    author: "Master Trainer",
    date: "November 15, 2025",
    readTime: "6 min read",
    image: "/images/blog-training.png",
    tags: ["Training", "Yields", "Techniques"],
    quiz: [
      {
        question: {
          en: "What is the main goal of plant training?",
          tr: "Bitki eğitiminin ana hedefi nedir?"
        },
        options: {
          en: [
            "To make the plant look pretty",
            "To expose more bud sites to light and control height",
            "To reduce water usage",
            "To change the plant's color"
          ],
          tr: [
            "Bitkiyi güzel göstermek için",
            "Daha fazla tomurcuğu ışığa maruz bırakmak ve yüksekliği kontrol etmek",
            "Su kullanımını azaltmak için",
            "Bitkinin rengini değiştirmek için"
          ]
        },
        correctAnswer: 1,
        explanation: {
          en: "Training creates an even canopy, ensuring all bud sites receive equal light, which maximizes yield.",
          tr: "Eğitim, eşit bir kanopi oluşturarak tüm tomurcuğun eşit ışık almasını sağlar ve bu da verimi maksimize eder."
        }
      },
      {
        question: {
          en: "Which technique involves cutting the main tip of the plant?",
          tr: "Hangi teknik bitkinin ana ucunu kesmeyi içerir?"
        },
        options: {
          en: [
            "LST",
            "Topping (HST)",
            "Watering",
            "Defoliation"
          ],
          tr: [
            "LST",
            "Topping (HST)",
            "Sulama",
            "Yaprak alma"
          ]
        },
        correctAnswer: 1,
        explanation: {
          en: "Topping is a High Stress Training technique where the apical meristem is removed to break apical dominance.",
          tr: "Topping, apikal dominansı kırmak için apikal meristemin çıkarıldığı Yüksek Stres Eğitimi tekniğidir."
        }
      },
      {
        question: {
          en: "Why is LST recommended for autoflowers?",
          tr: "Neden LST otomatik çiçekler için önerilir?"
        },
        options: {
          en: [
            "It is faster",
            "Autoflowers have a short life and can't recover easily from HST",
            "Autoflowers don't like light",
            "LST increases height"
          ],
          tr: [
            "Daha hızlıdır",
            "Otomatik çiçeklerin kısa bir ömrü vardır ve HST'den kolayca toparlanamazlar",
            "Otomatik çiçekler ışığı sevmez",
            "LST yüksekliği artırır"
          ]
        },
        correctAnswer: 1,
        explanation: {
          en: "Autoflowers have a limited vegetative period. HST can stunt them, whereas LST allows training without recovery downtime.",
          tr: "Otomatik çiçekler sınırlı bir vejetatif döneme sahiptir. HST onları duraklatabilirken, LST iyileşme süresi olmadan eğitim almalarına olanak tanır."
        }
      }
    ]
  },
  {
    id: 6,
    slug: {
      en: "nutrient-basics-npk-explained",
      tr: "besin-temelleri-npk-aciklandi"
    },
    title: {
      en: "Nutrient Basics: N-P-K Explained",
      tr: "Besin Temelleri: N-P-K Açıklandı"
    },
    excerpt: {
      en: "Decoding the numbers on your fertilizer bottle. What Nitrogen, Phosphorus, and Potassium actually do.",
      tr: "Gübre şişenizdeki rakamların şifresini çözmek. Azot, Fosfor ve Potasyum'un gerçekten ne yaptığı."
    },
    category: "Nutrients",
    content: {
      en: `
        <p>Every fertilizer bottle has three numbers on the front, like 4-4-4 or 2-8-4. These represent the percentage by weight of the three primary macronutrients: Nitrogen (N), Phosphorus (P), and Potassium (K).</p>
        
        <h3>The Big Three</h3>
        <ul>
          <li><strong>Nitrogen (N):</strong> Essential for leafy green growth. High demand during the vegetative stage.</li>
          <li><strong>Phosphorus (P):</strong> Crucial for root development and flower/fruit production. High demand during early flowering.</li>
          <li><strong>Potassium (K):</strong> Regulates water uptake and overall plant health. Important throughout the life cycle, especially in flowering.</li>
        </ul>
        
        <p>Using the wrong ratio at the wrong time can lead to nutrient burn or deficiencies. Always follow a feeding schedule designed for your specific medium.</p>
      `,
      tr: `
        <p>Her gübre şişesinin önünde 4-4-4 veya 2-8-4 gibi üç rakam bulunur. Bu rakamlar, üç ana makro besin maddesinin - Azot (N), Fosfor (P) ve Potasyum (K) - ağırlıkça yüzdesini temsil eder.</p>
        
        <h3>Üç Büyükler</h3>
        <ul>
          <li><strong>Azot (N):</strong> Yeşil yapraklı bitki büyümesi için gereklidir. Vejetatif dönemde yüksek talep görür.</li>
          <li><strong>Fosfor (P):</strong> Kök gelişimi ve çiçek/meyve üretimi için hayati öneme sahiptir. Erken çiçeklenme döneminde yüksek talep görür.</li>
          <li><strong>Potasyum (K):</strong> Su alımını ve genel bitki sağlığını düzenler. Tüm yaşam döngüsü boyunca, özellikle çiçeklenme döneminde önemlidir.</li>
        </ul>
        
        <p>Yanlış oranı yanlış zamanda kullanmak, besin yanığına veya eksikliklerine yol açabilir. Her zaman belirli ortamınıza göre tasarlanmış bir besin takviyesi programına uyun.</p>
      `
    },
    author: "Chem Grow",
    date: "November 18, 2025",
    readTime: "5 min read",
    image: "/images/blog-nutrients.png",
    tags: ["Nutrients", "Basics", "Chemistry"],
    quiz: [
      {
        question: {
          en: "What does the 'N' in N-P-K stand for?",
          tr: "N-P-K'daki 'N' neyi ifade eder?"
        },
        options: {
          en: [
            "Nickel",
            "Nitrogen",
            "Neon",
            "Neutron"
          ],
          tr: [
            "Nikel",
            "Azot",
            "Neon",
            "Nötron"
          ]
        },
        correctAnswer: 1,
        explanation: {
          en: "N stands for Nitrogen, the primary nutrient responsible for vegetative growth.",
          tr: "N, vejetatif büyümeyi sağlayan birincil besin maddesi olan Azot'u ifade eder."
        }
      },
      {
        question: {
          en: "Which nutrient is most important for leafy green growth?",
          tr: "Hangi besin maddesi yeşil yapraklı bitki büyümesi için en önemlisidir?"
        },
        options: {
          en: [
            "Phosphorus",
            "Potassium",
            "Nitrogen",
            "Calcium"
          ],
          tr: [
            "Fosfor",
            "Potasyum",
            "Azot",
            "Kalsiyum"
          ]
        },
        correctAnswer: 2,
        explanation: {
          en: "Nitrogen is a key component of chlorophyll and amino acids, driving leafy green growth.",
          tr: "Azot, klorofil ve amino asitlerin ana bileşenidir ve yeşil yapraklı bitki büyümesini destekler."
        }
      },
      {
        question: {
          en: "When is Phosphorus typically in highest demand?",
          tr: "Fosfor genellikle en yüksek talep gördüğü zaman nedir?"
        },
        options: {
          en: [
            "Seedling stage",
            "Vegetative stage",
            "Early flowering and root development",
            "Flushing stage"
          ],
          tr: [
            "Fide aşaması",
            "Vejetatif aşama",
            "Erken çiçeklenme ve kök gelişimi",
            "Yıkama aşaması"
          ]
        },
        correctAnswer: 2,
        explanation: {
          en: "Phosphorus is vital for energy transfer and the development of roots and flowers.",
          tr: "Fosfor, enerji transferi ve kökler ile çiçeklerin gelişimi için hayati öneme sahiptir."
        }
      }
    ]
  },
  {
    id: 7,
    slug: {
      en: "harvesting-the-perfect-moment",
      tr: "hasat-mukemmel-an"
    },
    title: {
      en: "Harvesting: The Perfect Moment",
      tr: "Harvesting: The Perfect Moment"
    },
    excerpt: {
      en: "Know exactly when to pick your tomatoes and peppers for maximum flavor and nutrition.",
      tr: "Domates ve biberlerinizi maksimum lezzet ve besin değeri için ne zaman toplayacağınızı tam olarak bilin."
    },
    category: "Harvest",
    content: {
      en: `
        <p>After weeks of watering, feeding, and pruning, your indoor garden is finally bearing fruit. But when is the right time to pick? Harvesting at the perfect moment ensures the best flavor, texture, and nutritional value.</p>
        
        <h3>Tomatoes</h3>
        <p>For the best flavor, let tomatoes ripen fully on the vine. Look for:</p>
        <ul>
          <li><strong>Deep Color:</strong> They should be a rich, uniform red (or yellow/purple depending on variety).</li>
          <li><strong>Slight Give:</strong> The fruit should feel firm but yield slightly to gentle pressure.</li>
          <li><strong>Easy Release:</strong> Ripe tomatoes often snap off the vine easily with a gentle twist.</li>
        </ul>

        <h3>Peppers</h3>
        <p>Peppers can be harvested at various stages. Green peppers are unripe but crunchy. As they mature to red, orange, or yellow, they become sweeter and richer in Vitamin C.</p>
        
        <p><strong>Pro Tip:</strong> Harvest in the morning when the plant is most hydrated for crispier produce.</p>
      `,
      tr: `
        <p>Haftalarca sulama, besin verme ve budama işlemlerinden sonra, kapalı bahçeniz nihayet meyve vermeye başladı. Ama ne zaman toplamak için doğru zaman? Hasat zamanı, en iyi lezzet, doku ve besin değeri için mükemmel anı yakalamak önemlidir.</p>
        
        <h3>Domates</h3>
        <p>En iyi lezzet için, domateslerin tamamen olgunlaşmasına izin verin. Aşağıdakilere dikkat edin:</p>
        <ul>
          <li><strong>Derin Renk:</strong> Zengin, tekdüze bir kırmızı (veya çeşidine bağlı olarak sarı/mor) olmalıdır.</li>
          <li><strong>Hafif Yumuşaklık:</strong> Meyve, hafif bir baskıya karşı sağlam hissetmeli ancak biraz yumuşamalıdır.</li>
          <li><strong>Kolay Ayrılma:</strong> Olgun domatesler genellikle nazik bir çevirme ile dalından kolayca kopar.</li>
        </ul>

        <h3>Biberler</h3>
        <p>Biberler çeşitli aşamalarda hasat edilebilir. Yeşil biberler olgunlaşmamış ama çıtırdır. Kırmızı, turuncu veya sarı renge olgunlaştıkça, daha tatlı ve C vitamini açısından zengin hale gelirler.</p>
        
        <p><strong>Profesyonel İpucu:</strong> Daha çıtır ürünler için bitki en fazla suya sahipken sabahları hasat yapın.</p>
      `
    },
    author: "Master Gardener",
    date: "November 20, 2025",
    readTime: "4 min read",
    image: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?q=80&w=800&auto=format&fit=crop",
    tags: ["Harvest", "Vegetables", "Guides"],
    quiz: [
      {
        question: {
          en: "When is the best time of day to harvest vegetables?",
          tr: "Sebzeleri hasat etmek için günün en iyi saati ne zamandır?"
        },
        options: {
          en: [
            "High noon",
            "In the morning",
            "Late at night",
            "It doesn't matter"
          ],
          tr: [
            "Öğle vakti",
            "Sabah",
            "Gece yarısı",
            "Fark etmez"
          ]
        },
        correctAnswer: 1,
        explanation: {
          en: "Harvesting in the morning when plants are fully hydrated ensures crispier, fresher-tasting produce.",
          tr: "Bitkiler tamamen suya doymuşken sabahları hasat yapmak, daha çıtır ve taze tatlı ürünler sağlar."
        }
      },
      {
        question: {
          en: "How do you know a tomato is fully ripe?",
          tr: "Bir domatesin tam olgunlaştığını nasıl anlarsınız?"
        },
        options: {
          en: [
            "It is hard as a rock",
            "It is completely green",
            "It has deep uniform color and yields slightly to pressure",
            "It falls on the floor"
          ],
          tr: [
            "Taş gibi sert",
            "Tamamen yeşil",
            "Derin tekdüze renge sahip ve hafifçe basınca verir",
            "Düştüğünde"
          ]
        },
        correctAnswer: 2,
        explanation: {
          en: "A ripe tomato should have its full characteristic color and feel firm but not hard.",
          tr: "Olgun bir domates, tam karakteristik rengini almalı ve sert ama sert olmamalıdır."
        }
      },
      {
        question: {
          en: "What happens to peppers as they change from green to red/yellow?",
          tr: "Biberler yeşilden kırmızı/sarıya dönerken ne olur?"
        },
        options: {
          en: [
            "They become more bitter",
            "They lose all nutritional value",
            "They become sweeter and richer in Vitamin C",
            "They become poisonous"
          ],
          tr: [
            "Daha acı olur",
            "Tüm besin değerini kaybeder",
            "Daha tatlı ve C vitamini açısından zenginleşir",
            "Zehirli hale gelir"
          ]
        },
        correctAnswer: 2,
        explanation: {
          en: "Ripening peppers develop sugars and increase their vitamin content, making them sweeter and more nutritious.",
          tr: "Olgunlaşan biberler şeker geliştirir ve vitamin içeriğini artırır, bu da onları daha tatlı ve besleyici hale getirir."
        }
      }
    ]
  }
];

export const categories = ["All", "Lighting", "Hydroponics", "Environment", "Automation", "Training", "Nutrients", "Harvest"];
