import React from 'react';
import { useSettings } from '../../context/SettingsContext';

const faqItemsEn = [
    { q: "Why do plants need light?", a: "To perform photosynthesis." },
    { q: "Why is photosynthesis important?", a: "Plants produce their food this way." },
    { q: "Which plants are suitable for indoor growing?", a: "Herbs, vegetables, flowers." },
    { q: "What happens if I don't install a fan in my grow tent?", a: "Temperature rises, mold forms." },
    { q: "How many hours of light per day during vegetative stage?", a: "16 hours is generally sufficient." },
    { q: "How many hours of light per day during flowering stage?", a: "12 hours is generally sufficient." },
    { q: "Why LED lights?", a: "Efficient, cool, and long-lasting." },
    { q: "How long does germination typically take?", a: "Usually 3 to 10 days." },
    { q: "What should humidity be in the tent during vegetative stage?", a: "50–70% is ideal." }
];

const faqItemsTr = [
    { q: "Bitkiler neden yapay ışığa ihtiyaç duyar?", a: "Bitkiler büyümek, gelişmek ve enerji üretmek için fotosentez yapar. İç mekan yetiştiriciliğinde doğal güneş ışığı yeterli olmadığından yapay aydınlatma (özellikle LED grow ışıkları) kullanılır." },
    { q: "Fotosentez neden bitki sağlığı için kritiktir?", a: "Fotosentez, bitkilerin su ve karbondioksiti güneş (veya yapay) ışığı ile şekere dönüştürmesini sağlar. Bu süreç, bitkinin enerji kaynağını oluşturur ve sağlıklı gelişimi mümkün kılar." },
    { q: "İç mekanda hangi bitki türleri yetiştirilebilir?", a: "Aromatik otlar (fesleğen, nane), yapraklı sebzeler (marul, ıspanak) ve bazı çiçekli türler (orkide, sardunya) iç mekan yetiştiriciliğine uygundur. Bu bitkiler sınırlı alanda, kontrollü iklim şartlarında iyi sonuç verir." },
    { q: "Fan olmayan yetiştirme kabininde ne olur?", a: "Fan kullanılmayan kabinlerde hava dolaşımı olmaz, bu da sıcaklık artışına ve nem birikmesine neden olur. Sonuç olarak mantar oluşumu, küf ve bitki hastalıkları riski yükselir." },
    { q: "Büyüme döneminde bitkiye günde kaç saat ışık verilmeli?", a: "Büyüme (vejetatif) aşamasında çoğu bitki 16–18 saatlik ışık süresine ihtiyaç duyar. Bu süre, yaprak gelişimini ve sağlıklı gövde oluşumunu destekler." },
    { q: "Çiçeklenme döneminde ışık süresi ne olmalı?", a: "Çiçeklenme döneminde fotoperiyodik bitkiler için 12 saat ışık, 12 saat karanlık döngüsü uygulanmalıdır. Bu denge, çiçek ve meyve oluşumunu teşvik eder." },
    { q: "LED grow ışıklarının avantajı nedir?", a: "LED bitki lambaları, düşük enerji tüketimi, uzun ömür ve minimal ısı yayımı ile ideal iç mekan aydınlatması sunar. Ayrıca, bitki evresine uygun tam spektrum ışık sağlayabilir." },
    { q: "Tohumlar çimlenme döneminde kaç günde filizlenir?", a: "Çimlenme süresi bitki türüne bağlı olmakla birlikte genellikle 3 ila 10 gün arasında tamamlanır. Bu dönemde nemli ortam ve sabit sıcaklık sağlanmalıdır." },
    { q: "Büyüme döneminde çadır içi nem oranı ne olmalı?", a: "Vejetatif büyüme aşamasında ideal nem oranı %50 ila %70 aralığındadır. Bu nem seviyesi, yaprakların su kaybını dengeleyerek hızlı gelişimi destekler." }
];

export default function FAQSection() {
    const { language, t } = useSettings();
    const faqItems = language === 'en' ? faqItemsEn : faqItemsTr;

    return (
        <section className="faq-section">
            <div className="section-header">
                <h2>❓ {t('landingFaqTitle')}</h2>
                <p>{t('landingFaqSubtitle')}</p>
            </div>
            <div className="faq-grid">
                {faqItems.map((item, index) => (
                    <div key={index} className="faq-item">
                        <h3>{item.q}</h3>
                        <p>{item.a}</p>
                    </div>
                ))}
            </div>
        </section>
    );
}
