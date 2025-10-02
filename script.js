// DEBUG AMAÇLI HIZLI SIFIRLAMA KODU:
//localStorage.clear();

// Son temizlik tarihi en eski olan kişi, sıradaki kişi olarak atanacaktır.
// 1. Başlangıç Verileri
const odadakiler = [
    { isim: "Gamze", sonTemizlikTarihi: "2025-09-30" },
    { isim: "Sena", sonTemizlikTarihi: "2025-09-24" },  
    { isim: "Sinem", sonTemizlikTarihi: "2025-09-26" }, 
    { isim: "Beril", sonTemizlikTarihi: "2025-09-28" }
];

// Veriyi localStorage'dan yükle (önceki kaydı kontrol et)
function veriyiYukle() {
    const kayitliVeri = localStorage.getItem('temizlikVerileri');
    if (kayitliVeri) {
        // localStorage'daki veriyi ana diziye aktar
        Object.assign(odadakiler, JSON.parse(kayitliVeri));
    }
}

// Kişileri son temizlik tarihlerine göre sıralar. En eskisi en başta olur.
function siradakiKim() {
    // Geçici olarak sıralıyoruz
    const siraliListe = [...odadakiler].sort((a, b) => 
        new Date(a.sonTemizlikTarihi) - new Date(b.sonTemizlikTarihi)
    );
    return siraliListe[0]; // Sıradaki kişi
}

// 3. Temizliği Tamamlama İşlevi
function goreviTamamla(kisiAdi) {
    // Sadece sıradaki kişinin görevi tamamlayabilmesi için kontrol
    const siradaki = siradakiKim();
    if (kisiAdi !== siradaki.isim) {
        alert("Sadece sıradaki kişi görevi tamamlayabilir!");
        return;
    }

    const kisiIndex = odadakiler.findIndex(k => k.isim === kisiAdi);

    if (kisiIndex !== -1) {
        // Son temizlik tarihini bugünün YYYY-MM-DD formatında kaydet
        odadakiler[kisiIndex].sonTemizlikTarihi = new Date().toISOString().split('T')[0];
        
        // Veriyi localStorage'a geri kaydet
        localStorage.setItem('temizlikVerileri', JSON.stringify(odadakiler));

        // Arayüzü güncellemeden önce başarılı bildirim
        alert(`${kisiAdi} görevi tamamladı! WhatsApp grubuna bildirim gönderiliyor...`);
        
        // WhatsApp Yönlendirmesi (Yazılımcı Dokunuşu)
        const whatsappMesaj = `🥳 ${kisiAdi} Temizliği yaptı 🧹.`;
        // Tarayıcıyı WhatsApp grubuna mesaj göndermeye yönlendirir. 
        // Kullanıcı bu aşamada göndermeyi onaylamalıdır.
        window.open(`https://wa.me/?text=${encodeURIComponent(whatsappMesaj)}`, '_blank');


        // Sayfayı yenileyerek yeni sırayı göster
        listeyiGuncelle();
    }
}

// 4. Arayüzü Güncelleme 
function listeyiGuncelle() {
    const listContainer = document.getElementById('sira-listesi');
    listContainer.innerHTML = '<h2>Sıra Listesi</h2>';

    const siradaki = siradakiKim();

    // Önce listeyi son temizlik tarihine göre sırala (en eski en başta)
    let gosterilecekListe = [...odadakiler].sort((a, b) => 
        new Date(a.sonTemizlikTarihi) - new Date(b.sonTemizlikTarihi)
    );
    // Ardından sıradaki kişiyi en başa alacak şekilde yeniden sırala    
    gosterilecekListe = gosterilecekListe.sort((a, b) => {
        if (a.isim === siradaki.isim) return -1; // Sıradaki kişi (A) her zaman B'den önce gelir
        if (b.isim === siradaki.isim) return 1;  // Sıradaki kişi (B) her zaman A'dan önce gelir
        
        // Diğerlerini son temizlik tarihlerine göre (en yeni temizlik yapan en sağda) sırala
        return new Date(a.sonTemizlikTarihi) - new Date(b.sonTemizlikTarihi);
    });

    // Listeyi ekrana bas
    gosterilecekListe.forEach(kisi => {
        const isActive = kisi.isim === siradaki.isim;
        const buttonText = isActive ? '✅ TEMİZLİĞİ BİTİRDİM' : 'Sıra Dışı';
        const buttonDisabled = !isActive ? 'disabled' : '';

        listContainer.innerHTML += `
            <div class="kisi-kart ${isActive ? 'active' : ''}">
                <h3>${kisi.isim} ${isActive ? '👉 SIRA SENDE!' : ''}</h3>
                <p>Son Temizlik: ${kisi.sonTemizlikTarihi}</p>
                <button onclick="goreviTamamla('${kisi.isim}')" ${buttonDisabled}>
                    ${buttonText}
                </button>
            </div>
        `;
    });
}


// Sayfa yüklendiğinde çalışacak ana kısım
document.addEventListener('DOMContentLoaded', () => {
    veriyiYukle(); // Önceki veriyi yükle
    listeyiGuncelle(); // Listeyi göster
});