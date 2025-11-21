export const blogPosts = [
  {
    id: 1,
    slug: "understanding-ppfd-key-to-massive-yields",
    title: "Understanding PPFD: The Key to Massive Yields",
    excerpt: "Why lumens don't matter and how to measure the light your plants actually use for photosynthesis.",
    category: "Lighting",
    content: `
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
    author: "Dr. Green",
    date: "October 15, 2025",
    readTime: "5 min read",
    image: "https://images.unsplash.com/photo-1550989460-0adf9ea622e2?q=80&w=800&auto=format&fit=crop",
    tags: ["Lighting", "Science", "Guides"],
    quiz: [
      {
        question: "What is the optimal PPFD range for the flowering stage?",
        options: [
          "200-400 μmol/m²/s",
          "400-600 μmol/m²/s",
          "600-1000+ μmol/m²/s",
          "100-200 μmol/m²/s"
        ],
        correctAnswer: 2,
        explanation: "Flowering plants need intense light energy to produce dense buds, typically requiring 600-1000+ μmol/m²/s."
      },
      {
        question: "What does PPFD measure?",
        options: [
          "Total light output of a bulb",
          "Light intensity visible to humans",
          "Light reaching the canopy used for photosynthesis",
          "Heat emitted by the light"
        ],
        correctAnswer: 2,
        explanation: "PPFD measures the specific photons that land on the plant canopy and drive photosynthesis."
      },
      {
        question: "Why are lumens not a good metric for grow lights?",
        options: [
          "They are too hard to measure",
          "They measure light based on human vision, not plant needs",
          "They are only for incandescent bulbs",
          "They are always inaccurate"
        ],
        correctAnswer: 1,
        explanation: "Lumens are weighted to human sensitivity (green/yellow light), while plants use mostly red and blue light."
      }
    ]
  },
  {
    id: 2,
    slug: "hydroponics-vs-soil-which-is-right",
    title: "Hydroponics vs. Soil: Which is Right for You?",
    excerpt: "A deep dive into the pros and cons of soil-less growing compared to traditional methods.",
    category: "Hydroponics",
    content: `
      <p>The age-old debate: nature's way or the high-tech way? Both soil and hydroponic systems have their place in the modern grower's toolkit, but choosing the right one depends on your goals, budget, and experience level.</p>
      
      <h3>Soil Growing</h3>
      <p>Soil is forgiving. It buffers pH fluctuations and holds nutrients, giving you a safety net if you miss a feeding. It's often said to produce a more complex terpene profile, though yields may be slightly lower than hydro.</p>
      
      <h3>Hydroponics</h3>
      <p>Hydroponics is about speed and precision. By delivering nutrients directly to the roots in a highly oxygenated solution, plants can grow up to <strong>20-30% faster</strong>. However, things can go wrong quickly if a pump fails or pH drifts.</p>
      
      <blockquote>"Hydroponics is like driving a Formula 1 car; Soil is like driving a reliable pickup truck. Both get you there, but one requires a lot more attention."</blockquote>
    `,
    author: "Alex Flora",
    date: "October 22, 2025",
    readTime: "8 min read",
    image: "https://images.unsplash.com/photo-1556559322-b5071efadc88?q=80&w=800&auto=format&fit=crop",
    tags: ["Hydroponics", "Soil", "Basics"],
    quiz: [
      {
        question: "Which growing method typically results in faster growth rates?",
        options: [
          "Soil",
          "Hydroponics",
          "Both are the same",
          "Aeroponics only"
        ],
        correctAnswer: 1,
        explanation: "Hydroponics delivers nutrients directly to the roots with high oxygen, allowing for 20-30% faster growth."
      },
      {
        question: "What is a main advantage of soil growing?",
        options: [
          "It requires no nutrients",
          "It is faster than hydro",
          "It buffers pH and is more forgiving",
          "It uses no water"
        ],
        correctAnswer: 2,
        explanation: "Soil acts as a buffer for pH and nutrients, making it more forgiving of mistakes than hydroponics."
      },
      {
        question: "What is a risk of hydroponics?",
        options: [
          "Plants grow too slow",
          "System failures can damage plants quickly",
          "It attracts more pests",
          "It requires sunlight"
        ],
        correctAnswer: 1,
        explanation: "Because roots are exposed or in water, a pump failure or pH spike can damage plants very rapidly."
      }
    ]
  },
  {
    id: 3,
    slug: "automating-your-grow-tent",
    title: "Automating Your Grow Tent",
    excerpt: "How to use smart plugs, sensors, and controllers to put your garden on autopilot.",
    category: "Automation",
    content: `
      <p>Gone are the days of manually turning lights on and off. Modern grow technology allows you to monitor and control your environment from your smartphone, ensuring consistency that leads to top-shelf results.</p>
      
      <h3>Essential Automation</h3>
      <ol>
        <li><strong>Light Timers:</strong> The absolute bare minimum. Consistency is key for photoperiod plants.</li>
        <li><strong>Climate Controllers:</strong> Devices that trigger exhaust fans when temperature or humidity gets too high.</li>
        <li><strong>pH Monitors:</strong> Continuous monitoring of your reservoir's pH and EC levels.</li>
      </ol>
      
      <p>Automation doesn't just save time; it creates a stable environment that plants love. Less fluctuation means less stress, and less stress means bigger fruits and flowers.</p>
    `,
    author: "Tech Grower",
    date: "November 01, 2025",
    readTime: "6 min read",
    image: "/images/blog-automation.png",
    tags: ["Automation", "Tech", "Smart Grow"],
    quiz: [
      {
        question: "What is considered the 'absolute bare minimum' for automation?",
        options: [
          "pH Monitor",
          "Climate Controller",
          "Light Timer",
          "Automatic Watering"
        ],
        correctAnswer: 2,
        explanation: "Light timers are essential because consistent light cycles are critical for plant health and photoperiod regulation."
      },
      {
        question: "Why is environmental consistency important?",
        options: [
          "It saves electricity",
          "It reduces plant stress",
          "It looks cool",
          "It is required by law"
        ],
        correctAnswer: 1,
        explanation: "Stable environments reduce stress on plants, allowing them to focus energy on growth and flower production."
      },
      {
        question: "What does a climate controller typically control?",
        options: [
          "Nutrient levels",
          "Exhaust fans and humidifiers",
          "Light spectrum",
          "Water temperature"
        ],
        correctAnswer: 1,
        explanation: "Climate controllers manage temperature and humidity by turning exhaust fans, humidifiers, or heaters on and off."
      }
    ]
  },
  {
    id: 4,
    slug: "vpd-secret-to-perfect-transpiration",
    title: "VPD: The Secret to Perfect Transpiration",
    excerpt: "Vapor Pressure Deficit explained simply. Master this metric to optimize nutrient uptake.",
    category: "Environment",
    content: `
      <p>Vapor Pressure Deficit (VPD) is the difference between the amount of moisture in the air and how much moisture the air can hold at saturation. It's the driving force behind transpiration—how plants move water and nutrients from roots to leaves.</p>
      
      <h3>Why VPD Matters</h3>
      <p>If VPD is too low (air is too humid), plants can't transpire, leading to mold and nutrient lockout. If VPD is too high (air is too dry), plants close their stomata to save water, halting photosynthesis.</p>
      
      <p>Aim for a VPD of <strong>0.8-1.1 kPa</strong> in veg and <strong>1.2-1.5 kPa</strong> in flower for optimal results.</p>
    `,
    author: "Dr. Green",
    date: "November 10, 2025",
    readTime: "7 min read",
    image: "https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?q=80&w=800&auto=format&fit=crop",
    tags: ["Advanced", "Environment", "Science"],
    quiz: [
      {
        question: "What happens if VPD is too low (air is too humid)?",
        options: [
          "Plants dry out",
          "Photosynthesis speeds up",
          "Plants can't transpire efficiently",
          "Nutrient uptake increases"
        ],
        correctAnswer: 2,
        explanation: "Low VPD means the air is saturated, making it difficult for plants to release water vapor (transpire), which slows nutrient transport."
      },
      {
        question: "What is the recommended VPD range for the vegetative stage?",
        options: [
          "0.4-0.8 kPa",
          "0.8-1.1 kPa",
          "1.2-1.5 kPa",
          "1.5-2.0 kPa"
        ],
        correctAnswer: 1,
        explanation: "A VPD of 0.8-1.1 kPa is ideal for vegetative growth, balancing transpiration rates with humidity."
      },
      {
        question: "What drives transpiration in plants?",
        options: [
          "Wind speed",
          "Vapor Pressure Deficit (VPD)",
          "Soil pH",
          "Root size"
        ],
        correctAnswer: 1,
        explanation: "VPD is the pressure difference that pulls water up from the roots and out through the leaves."
      }
    ]
  },
  {
    id: 5,
    slug: "training-techniques-lst-vs-hst",
    title: "Training Techniques: LST vs. HST",
    excerpt: "Maximize your canopy and yields by training your plants. Learn the difference between Low and High Stress Training.",
    category: "Training",
    content: `
      <p>Plant training is the art of manipulating your plant's shape to expose more bud sites to light. In a grow tent, vertical space is limited, so training is essential for keeping plants short and wide.</p>
      
      <h3>Low Stress Training (LST)</h3>
      <p>LST involves gently bending and tying down stems to create an even canopy. It's safe, easy, and doesn't slow down growth. It's perfect for autoflowers or beginners.</p>
      
      <h3>High Stress Training (HST)</h3>
      <p>HST includes techniques like <strong>Topping</strong> (cutting the main tip) and <strong>Super Cropping</strong> (crushing the stem). These methods are traumatic but can dramatically increase yields by forcing the plant to build a stronger structure. HST requires a recovery period.</p>
    `,
    author: "Master Trainer",
    date: "November 15, 2025",
    readTime: "6 min read",
    image: "/images/blog-training.png",
    tags: ["Training", "Yields", "Techniques"],
    quiz: [
      {
        question: "What is the main goal of plant training?",
        options: [
          "To make the plant look pretty",
          "To expose more bud sites to light and control height",
          "To reduce water usage",
          "To change the plant's color"
        ],
        correctAnswer: 1,
        explanation: "Training creates an even canopy, ensuring all bud sites receive equal light, which maximizes yield."
      },
      {
        question: "Which technique involves cutting the main tip of the plant?",
        options: [
          "LST",
          "Topping (HST)",
          "Watering",
          "Defoliation"
        ],
        correctAnswer: 1,
        explanation: "Topping is a High Stress Training technique where the apical meristem is removed to break apical dominance."
      },
      {
        question: "Why is LST recommended for autoflowers?",
        options: [
          "It is faster",
          "Autoflowers have a short life and can't recover easily from HST",
          "Autoflowers don't like light",
          "LST increases height"
        ],
        correctAnswer: 1,
        explanation: "Autoflowers have a limited vegetative period. HST can stunt them, whereas LST allows training without recovery downtime."
      }
    ]
  },
  {
    id: 6,
    slug: "nutrient-basics-npk-explained",
    title: "Nutrient Basics: N-P-K Explained",
    excerpt: "Decoding the numbers on your fertilizer bottle. What Nitrogen, Phosphorus, and Potassium actually do.",
    category: "Nutrients",
    content: `
      <p>Every fertilizer bottle has three numbers on the front, like 4-4-4 or 2-8-4. These represent the percentage by weight of the three primary macronutrients: Nitrogen (N), Phosphorus (P), and Potassium (K).</p>
      
      <h3>The Big Three</h3>
      <ul>
        <li><strong>Nitrogen (N):</strong> Essential for leafy green growth. High demand during the vegetative stage.</li>
        <li><strong>Phosphorus (P):</strong> Crucial for root development and flower/fruit production. High demand during early flowering.</li>
        <li><strong>Potassium (K):</strong> Regulates water uptake and overall plant health. Important throughout the life cycle, especially in flowering.</li>
      </ul>
      
      <p>Using the wrong ratio at the wrong time can lead to nutrient burn or deficiencies. Always follow a feeding schedule designed for your specific medium.</p>
    `,
    author: "Chem Grow",
    date: "November 18, 2025",
    readTime: "5 min read",
    image: "/images/blog-nutrients.png",
    tags: ["Nutrients", "Basics", "Chemistry"],
    quiz: [
      {
        question: "What does the 'N' in N-P-K stand for?",
        options: [
          "Nickel",
          "Nitrogen",
          "Neon",
          "Neutron"
        ],
        correctAnswer: 1,
        explanation: "N stands for Nitrogen, the primary nutrient responsible for vegetative growth."
      },
      {
        question: "Which nutrient is most important for leafy green growth?",
        options: [
          "Phosphorus",
          "Potassium",
          "Nitrogen",
          "Calcium"
        ],
        correctAnswer: 2,
        explanation: "Nitrogen is a key component of chlorophyll and amino acids, driving leafy green growth."
      },
      {
        question: "When is Phosphorus typically in highest demand?",
        options: [
          "Seedling stage",
          "Vegetative stage",
          "Early flowering and root development",
          "Flushing stage"
        ],
        correctAnswer: 2,
        explanation: "Phosphorus is vital for energy transfer and the development of roots and flowers."
      }
    ]
  },
  {
    id: 7,
    slug: "harvesting-the-perfect-moment",
    title: "Harvesting: The Perfect Moment",
    excerpt: "Know exactly when to pick your tomatoes and peppers for maximum flavor and nutrition.",
    category: "Harvest",
    content: `
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
    author: "Master Gardener",
    date: "November 20, 2025",
    readTime: "4 min read",
    image: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?q=80&w=800&auto=format&fit=crop",
    tags: ["Harvest", "Vegetables", "Guides"],
    quiz: [
      {
        question: "When is the best time of day to harvest vegetables?",
        options: [
          "High noon",
          "In the morning",
          "Late at night",
          "It doesn't matter"
        ],
        correctAnswer: 1,
        explanation: "Harvesting in the morning when plants are fully hydrated ensures crispier, fresher-tasting produce."
      },
      {
        question: "How do you know a tomato is fully ripe?",
        options: [
          "It is hard as a rock",
          "It is completely green",
          "It has deep uniform color and yields slightly to pressure",
          "It falls on the floor"
        ],
        correctAnswer: 2,
        explanation: "A ripe tomato should have its full characteristic color and feel firm but not hard."
      },
      {
        question: "What happens to peppers as they change from green to red/yellow?",
        options: [
          "They become more bitter",
          "They lose all nutritional value",
          "They become sweeter and richer in Vitamin C",
          "They become poisonous"
        ],
        correctAnswer: 2,
        explanation: "Ripening peppers develop sugars and increase their vitamin content, making them sweeter and more nutritious."
      }
    ]
  }
];

export const categories = ["All", "Lighting", "Hydroponics", "Environment", "Automation", "Training", "Nutrients", "Harvest"];
