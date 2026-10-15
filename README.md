# Registracija - Twitch

To je spletni obrazec za registracijo, ki vizualno in funkcionalno posnema platformo **Twitch**. Projekt je bil ustvarjen v okviru šolske naloge.

## 🚀 Uporabljene tehnologije
* **HTML5** – Struktura obrazca in semantični elementi.
* **CSS3** – Napredno oblikovanje, odzivni dizajn (Flexbox, Grid) in Twitch temni način.
* **JavaScript (ES6+)** – Dinamična validacija vnosov, preklapljanje med načini vnosa (telefon/e-pošta) in obdelava dogodkov.
* **SweetAlert2** – Moderni pojavni okni (modalna obvestila).

## ✨ Glavne funkcionalnosti
* **Preverjanje podatkov (Validacija):**
  * Uporabniško ime (od 4 do 25 znakov, brez šumnikov, dovoljene le črke, številke in podčrtaji).
  * Geslo (zahtevan vnos vsaj 8 znakov z možnostjo prikaza/skrivanja gesla).
  * Datum rojstva (preverjanje veljavnosti datuma in preverjanje starostne omejitve – vsaj 13 let).
  * Telefonska številka ali e-poštni naslov (dinamičen preklop z gumbom "Raje uporabi e-pošto / telefon").
* **Odzivni dizajn (Responsive):** Prilagojen je za delovanje na različnih velikostih zaslonov (računalniki, tablice, pametni telefoni).
* **Interaktivna obvestila:** Uporaba knjižnice SweetAlert2 za potrditve vnosa in opozorila o napakah.
