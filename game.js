// a new SAVE_VERSION starts from a blank slate (old progress is kept as a backup)
const SAVE_VERSION = '2';
try {
    if (localStorage.getItem('elementalSaveVersion') !== SAVE_VERSION) {
        const oldSave = {};
        Object.keys(localStorage).filter(k => k.startsWith('elemental')).forEach(k => {
            oldSave[k] = localStorage.getItem(k);
            localStorage.removeItem(k);
        });
        if (Object.keys(oldSave).length) {
            localStorage.setItem('legacyElementalBackup', JSON.stringify(oldSave));
        }
        localStorage.setItem('elementalSaveVersion', SAVE_VERSION);
    }
} catch (e) {}

const ELEMENTS = [
    ['H', 'Hydrogen', 6],
    ['He', 'Helium', 42],
    ['Li', 'Lithium', 129],
    ['Be', 'Beryllium', 323],
    ['B', 'Boron', 402],
    ['C', 'Carbon', 23],
    ['N', 'Nitrogen', 42],
    ['O', 'Oxygen', 3],
    ['F', 'Fluorine', 251],
    ['Ne', 'Neon', 1796],
    ['Na', 'Sodium', 10823],
    ['Mg', 'Magnesium', 323],
    ['Al', 'Aluminium', 186],
    ['Si', 'Silicon', 5578],
    ['P', 'Phosphorus', 186],
    ['S', 'Sulfur', 81],
    ['Cl', 'Chlorine', 129],
    ['Ar', 'Argon', 1796],
    ['K', 'Potassium', 17321],
    ['Ca', 'Calcium', 251],
    ['Sc', 'Scandium', 24945],
    ['Ti', 'Titanium', 402],
    ['V', 'Vanadium', 10823],
    ['Cr', 'Chromium', 487],
    ['Mn', 'Manganese', 1247],
    ['Fe', 'Iron', 579],
    ['Co', 'Cobalt', 3485],
    ['Ni', 'Nickel', 1247],
    ['Cu', 'Copper', 186],
    ['Zn', 'Zinc', 323],
    ['Ga', 'Gallium', 10823],
    ['Ge', 'Germanium', 13924],
    ['As', 'Arsenic', 8033],
    ['Se', 'Selenium', 3485],
    ['Br', 'Bromine', 1796],
    ['Kr', 'Krypton', 24945],
    ['Rb', 'Rubidium', 53785],
    ['Sr', 'Strontium', 1796],
    ['Y', 'Yttrium', 17321],
    ['Zr', 'Zirconium', 10823],
    ['Nb', 'Niobium', 33607],
    ['Mo', 'Molybdenum', 5578],
    ['Tc', 'Technetium', 1038663],
    ['Ru', 'Ruthenium', 53785],
    ['Rh', 'Rhodium', 150289],
    ['Pd', 'Palladium', 17321],
    ['Ag', 'Silver', 129],
    ['Cd', 'Cadmium', 4696],
    ['In', 'Indium', 20999],
    ['Sn', 'Tin', 1247],
    ['Sb', 'Antimony', 8033],
    ['Te', 'Tellurium', 24945],
    ['I', 'Iodine', 1003],
    ['Xe', 'Xenon', 43237],
    ['Cs', 'Caesium', 65204],
    ['Ba', 'Barium', 1796],
    ['La', 'Lanthanum', 24945],
    ['Ce', 'Cerium', 10823],
    ['Pr', 'Praseodymium', 65204],
    ['Nd', 'Neodymium', 43237],
    ['Pm', 'Promethium', 1549018],
    ['Sm', 'Samarium', 65204],
    ['Eu', 'Europium', 33607],
    ['Gd', 'Gadolinium', 33607],
    ['Tb', 'Terbium', 104355],
    ['Dy', 'Dysprosium', 43237],
    ['Ho', 'Holmium', 104355],
    ['Er', 'Erbium', 43237],
    ['Tm', 'Thulium', 150289],
    ['Yb', 'Ytterbium', 24945],
    ['Lu', 'Lutetium', 65204],
    ['Hf', 'Hafnium', 24945],
    ['Ta', 'Tantalum', 43237],
    ['W', 'Tungsten', 2420],
    ['Re', 'Rhenium', 65204],
    ['Os', 'Osmium', 104355],
    ['Ir', 'Iridium', 65204],
    ['Pt', 'Platinum', 1796],
    ['Au', 'Gold', 251],
    ['Hg', 'Mercury', 1003],
    ['Tl', 'Thallium', 33607],
    ['Pb', 'Lead', 186],
    ['Bi', 'Bismuth', 1247],
    ['Po', 'Polonium', 1712206],
    ['At', 'Astatine', 2643713],
    ['Rn', 'Radon', 346402],
    ['Fr', 'Francium', 4766589],
    ['Ra', 'Radium', 240527],
    ['Ac', 'Actinium', 466677],
    ['Th', 'Thorium', 10823],
    ['Pa', 'Protactinium', 746881],
    ['U', 'Uranium', 52150385],
    ['Np', 'Neptunium', 2186769],
    ['Pu', 'Plutonium', 1712206],
    ['Am', 'Americium', 1872698],
    ['Cm', 'Curium', 2643713],
    ['Bk', 'Berkelium', 4766589],
    ['Cf', 'Californium', 4081997],
    ['Es', 'Einsteinium', 7359800],
    ['Fm', 'Fermium', 7359800],
    ['Md', 'Mendelevium', 8594113],
    ['No', 'Nobelium', 9797879],
    ['Lr', 'Lawrencium', 10976097],
    ['Rf', 'Rutherfordium', 13269647],
    ['Db', 'Dubnium', 14389952],
    ['Sg', 'Seaborgium', 15495102],
    ['Bh', 'Bohrium', 16586541],
    ['Hs', 'Hassium', 17665479],
    ['Mt', 'Meitnerium', 18732937],
    ['Ds', 'Darmstadtium', 19789794],
    ['Rg', 'Roentgenium', 20836807],
    ['Cn', 'Copernicium', 21874641],
    ['Nh', 'Nihonium', 22903880],
    ['Fl', 'Flerovium', 23925043],
    ['Mc', 'Moscovium', 24938592],
    ['Lv', 'Livermorium', 25944942],
    ['Ts', 'Tennessine', 26944470],
    ['Og', 'Oganesson', 28924388]
];
ELEMENTS.forEach(e => e[2] = e[0] === 'U' ? 12000000 : Math.max(2, Math.round(e[2] ** 0.82)));
const elementBySymbol = Object.fromEntries(ELEMENTS.map(e => [e[0], e]));
const JOKES = [
    ['Um', 'Ummium', 35000000, 'The element of surprise', [1, 1]],
    ['Zz', 'Snorium', 45000000, "Only reacts when it's woken up", [1, 18]],
    ['Mu', 'Mundanium', 55000000, 'The most ordinary element imaginable, somehow this rare', [2, 1]],
    ['Ln', 'Lostium', 70000000, 'Always in the last place you look', [2, 2]],
    ['Df', 'Deferrium', 90000000, 'Will react tomorrow', [2, 13]],
    ['Cz', 'Caffeinium', 120000000, 'Makes every neighbour jittery', [2, 14]],
    ['Mb', 'Maybium', 150000000, 'Exists until you check', [2, 15]],
    ['Dj', 'Déjà-vium', 190000000, "You've definitely rolled this before", [2, 16]],
    ['Ha', 'Halfinium', 230000000, 'Always exactly halfway through decaying', [2, 17]],
    ['Ad', 'Administratium', 280000000, 'The heaviest element; it slows everything around it down', [2, 18]],
    ['Nu', 'Nopeium', 350000000, 'Refuses to bond with anything', [3, 1]],
    ['Xx', 'Redactium', 500000000, '[DATA EXPUNGED]', [3, 2]],
    ['Uo', 'Unobtainium', 700000000, 'The one every scientist is after', [3, 16]],
    ['Zo', 'Zoomium', 1000000000, 'Already gone before you see it', [3, 17]],
    ['Gg', 'Gameoverium', 1500000000, 'The last element there will ever be', [3, 18]]
];
JOKES.forEach(j => elementBySymbol[j[0]] = j);
const JOKE_SYMS = new Set(JOKES.map(j => j[0]));
const isJoke = sym => JOKE_SYMS.has(sym);
const tableLayout = {};
function placeRow(p, a) {
    a.forEach(([s, c]) => tableLayout[s] = [p, c]);
}
placeRow(1, [['H', 1], ['He', 18]]);
placeRow(2, [['Li', 1], ['Be', 2], ['B', 13], ['C', 14], ['N', 15], ['O', 16], ['F', 17], ['Ne', 18]]);
placeRow(3, [['Na', 1], ['Mg', 2], ['Al', 13], ['Si', 14], ['P', 15], ['S', 16], ['Cl', 17], ['Ar', 18]]);
placeRow(4, [
    ['K', 1], ['Ca', 2], ['Sc', 3], ['Ti', 4], ['V', 5], ['Cr', 6], ['Mn', 7], ['Fe', 8], ['Co', 9], ['Ni', 10], ['Cu', 11], ['Zn', 12], ['Ga', 13], ['Ge', 14], ['As', 15], ['Se', 16], ['Br', 17], ['Kr', 18]
]);
placeRow(5, [
    ['Rb', 1], ['Sr', 2], ['Y', 3], ['Zr', 4], ['Nb', 5], ['Mo', 6], ['Tc', 7], ['Ru', 8], ['Rh', 9], ['Pd', 10], ['Ag', 11], ['Cd', 12], ['In', 13], ['Sn', 14], ['Sb', 15], ['Te', 16], ['I', 17], ['Xe', 18]
]);
placeRow(6, [
    ['Cs', 1], ['Ba', 2], ['Hf', 4], ['Ta', 5], ['W', 6], ['Re', 7], ['Os', 8], ['Ir', 9], ['Pt', 10], ['Au', 11], ['Hg', 12], ['Tl', 13], ['Pb', 14], ['Bi', 15], ['Po', 16], ['At', 17], ['Rn', 18]
]);
placeRow(7, [
    ['Fr', 1], ['Ra', 2], ['Rf', 4], ['Db', 5], ['Sg', 6], ['Bh', 7], ['Hs', 8], ['Mt', 9], ['Ds', 10], ['Rg', 11], ['Cn', 12], ['Nh', 13], ['Fl', 14], ['Mc', 15], ['Lv', 16], ['Ts', 17], ['Og', 18]
]);
['La', 'Ce', 'Pr', 'Nd', 'Pm', 'Sm', 'Eu', 'Gd', 'Tb', 'Dy', 'Ho', 'Er', 'Tm', 'Yb', 'Lu'].forEach((s, i) => tableLayout[s] = [9, i + 4]);
['Ac', 'Th', 'Pa', 'U', 'Np', 'Pu', 'Am', 'Cm', 'Bk', 'Cf', 'Es', 'Fm', 'Md', 'No', 'Lr'].forEach((s, i) => tableLayout[s] = [10, i + 4]);
const ACHIEVEMENTS = [
    {
        formula: 'H2O', name: 'Water', flavor: 'A tiny, bent molecule that covers most of Earth and makes life as we know it possible.', rarity: 'Common'
    },
    {
        formula: 'CO2', name: 'Carbon dioxide', flavor: 'Plants borrow this invisible gas to build sugars; too much in the atmosphere traps extra heat.', rarity: 'Common'
    },
    {
        formula: 'ClNa', name: 'Table salt', flavor: 'Sodium and chlorine make the familiar crystals that season food and help nerves work.', rarity: 'Rare'
    },
    {
        formula: 'O2', name: 'Oxygen', flavor: 'The reactive gas many organisms use to release energy from food.', rarity: 'Common'
    },
    {
        formula: 'O3', name: 'Ozone', flavor: 'High in the atmosphere it shields Earth from ultraviolet light; near the ground it is a pollutant.', rarity: 'Common'
    },
    {
        formula: 'NH3', name: 'Ammonia', flavor: 'Sharp-smelling and nitrogen-rich, ammonia is an important starting point for fertilisers.', rarity: 'Rare'
    },
    {
        formula: 'CH4', name: 'Methane', flavor: 'A simple carbon fuel and a powerful greenhouse gas.', rarity: 'Epic'
    },
    {
        formula: 'H2O2', name: 'Hydrogen peroxide', flavor: 'A reactive liquid used in bleaching and disinfection, breaking down into water and oxygen.', rarity: 'Common'
    },
    {
        formula: 'C2H4', name: 'Ethylene', flavor: 'A plant hormone that helps fruit ripen and a key industrial chemical.', rarity: 'Legendary'
    },
    {
        formula: 'C2H2', name: 'Acetylene', flavor: 'A highly combustible gas once used in bright lamps and now in metalworking.', rarity: 'Rare'
    },
    {
        formula: 'HCl', name: 'Hydrochloric acid', flavor: 'In water, this strong acid is also part of the stomach’s digestive chemistry.', rarity: 'Common'
    },
    {
        formula: 'H2SO4', name: 'Sulfuric acid', flavor: 'A major industrial chemical used in batteries, fertiliser production and refining.', rarity: 'Epic'
    },
    {
        formula: 'HNO3', name: 'Nitric acid', flavor: 'A strong acid and important industrial ingredient in fertilisers.', rarity: 'Uncommon'
    },
    {
        formula: 'NaOH', name: 'Sodium hydroxide', flavor: 'A caustic base used to make soap and clean industrial equipment.', rarity: 'Rare'
    },
    {
        formula: 'KOH', name: 'Potassium hydroxide', flavor: 'A strong base used in soft soaps and alkaline batteries.', rarity: 'Rare'
    },
    {
        formula: 'CaCO3', name: 'Calcium carbonate', flavor: 'Found in limestone, chalk, shells and many stalactites.', rarity: 'Rare'
    },
    {
        formula: 'CaO', name: 'Quicklime', flavor: 'Made by heating limestone; it reacts strongly with water.', rarity: 'Common'
    },
    {
        formula: 'Ca(OH)2', name: 'Slaked lime', flavor: 'Used in mortar and to reduce acidity in soil and water.', rarity: 'Rare'
    },
    {
        formula: 'MgSO4', name: 'Epsom salt', flavor: 'A magnesium salt often sold for baths and used in gardening.', rarity: 'Legendary'
    },
    {
        formula: 'CuSO4', name: 'Copper sulfate', flavor: 'Its vivid blue crystals make it a classic chemistry-lab compound.', rarity: 'Legendary'
    },
    {
        formula: 'SiO2', name: 'Silica', flavor: 'The main ingredient in quartz and sand, and a key material in glass.', rarity: 'Rare'
    },
    {
        formula: 'H2', name: 'Hydrogen gas', flavor: 'The lightest molecule, used in industry and explored as an energy carrier.', rarity: 'Common'
    },
    {
        formula: 'N2', name: 'Nitrogen gas', flavor: 'The quiet majority of the air, making up about four-fifths of the atmosphere.', rarity: 'Uncommon'
    },
    {
        formula: 'Cl2', name: 'Chlorine gas', flavor: 'A reactive greenish gas whose chemistry helps disinfect water.', rarity: 'Uncommon'
    },
    {
        formula: 'HF', name: 'Hydrofluoric acid', flavor: 'An unusually hazardous acid that can attack glass by reacting with silica.', rarity: 'Common'
    },
    {
        formula: 'CO', name: 'Carbon monoxide', flavor: 'An odourless, poisonous gas formed by incomplete combustion.', rarity: 'Common'
    },
    {
        formula: 'HCN', name: 'Hydrogen cyanide', flavor: 'A small, highly toxic molecule with a history in both chemistry and industry.', rarity: 'Uncommon'
    },
    {
        formula: 'NO', name: 'Nitric oxide', flavor: 'A signalling molecule in the body and a reactive gas in the atmosphere.', rarity: 'Common'
    },
    {
        formula: 'NO2', name: 'Nitrogen dioxide', flavor: 'A brownish air pollutant that contributes to smog and acid deposition.', rarity: 'Common'
    },
    {
        formula: 'N2O', name: 'Nitrous oxide', flavor: 'Known as laughing gas, it is used medically and is also a greenhouse gas.', rarity: 'Uncommon'
    },
    {
        formula: 'SO2', name: 'Sulfur dioxide', flavor: 'A pungent gas released by some volcanoes and burning sulfur-containing fuels.', rarity: 'Common'
    },
    {
        formula: 'SO3', name: 'Sulfur trioxide', flavor: 'A reactive sulfur oxide that forms sulfuric acid when combined with water.', rarity: 'Uncommon'
    },
    {
        formula: 'H2S', name: 'Hydrogen sulfide', flavor: 'A toxic gas known for its rotten-egg smell at low concentrations.', rarity: 'Uncommon'
    },
    {
        formula: 'HBr', name: 'Hydrobromic acid', flavor: 'A strong acid used to introduce bromine into organic molecules.', rarity: 'Uncommon'
    },
    {
        formula: 'HI', name: 'Hydroiodic acid', flavor: 'A strong hydrogen halide acid used in specialised chemical synthesis.', rarity: 'Uncommon'
    },
    {
        formula: 'LiCl', name: 'Lithium chloride', flavor: 'A hygroscopic salt used in laboratories and some industrial processes.', rarity: 'Uncommon'
    },
    {
        formula: 'KCl', name: 'Potassium chloride', flavor: 'A mineral salt used in fertilisers and as a substitute for table salt.', rarity: 'Epic'
    },
    {
        formula: 'KI', name: 'Potassium iodide', flavor: 'A source of iodine used in medicine and laboratory chemistry.', rarity: 'Epic'
    },
    {
        formula: 'NaF', name: 'Sodium fluoride', flavor: 'A fluoride salt used in carefully controlled amounts to help protect teeth.', rarity: 'Epic'
    },
    {
        formula: 'CaF2', name: 'Fluorite', flavor: 'A colourful mineral and a major natural source of fluorine.', rarity: 'Legendary'
    },
    {
        formula: 'AgCl', name: 'Silver chloride', flavor: 'A light-sensitive solid that helped make traditional photography possible.', rarity: 'Uncommon'
    },
    {
        formula: 'AgNO3', name: 'Silver nitrate', flavor: 'A light-sensitive silver salt used in analytical chemistry and photography.', rarity: 'Rare'
    },
    {
        formula: 'NaNO3', name: 'Sodium nitrate', flavor: 'A naturally occurring nitrate used as a fertiliser and industrial feedstock.', rarity: 'Legendary'
    },
    {
        formula: 'ZnO', name: 'Zinc oxide', flavor: 'A white powder used in sunscreens, rubber and protective ointments.', rarity: 'Common'
    },
    {
        formula: 'TiO2', name: 'Titanium dioxide', flavor: 'A bright white pigment used in paints and many everyday materials.', rarity: 'Uncommon'
    },
    {
        formula: 'Al2O3', name: 'Alumina', flavor: 'A hard ceramic oxide and the key feedstock for aluminium production.', rarity: 'Epic'
    },
    {
        formula: 'PbS', name: 'Galena', flavor: 'The principal ore of lead, recognised by its metallic grey appearance.', rarity: 'Uncommon'
    },
    {
        formula: 'SnO2', name: 'Cassiterite', flavor: 'The main ore of tin, important to metalworking for thousands of years.', rarity: 'Uncommon'
    },
    {
        formula: 'NaBr', name: 'Sodium bromide', flavor: 'A bromide salt used in laboratories and specialised chemical processes.', rarity: 'Epic'
    },
    {
        formula: 'KBr', name: 'Potassium bromide', flavor: 'A salt once common in photographic materials and infrared spectroscopy.', rarity: 'Epic'
    },
    {
        formula: 'MgO', name: 'Magnesia', flavor: 'A heat-resistant oxide used to line furnaces and make refractory ceramics.', rarity: 'Common'
    },
    {
        formula: 'CaCl2', name: 'Calcium chloride', flavor: 'A moisture-loving salt used for de-icing roads and drying gases.', rarity: 'Epic'
    },
    {
        formula: 'SiC', name: 'Silicon carbide', flavor: 'An extremely hard material used in abrasives and high-performance ceramics.', rarity: 'Rare'
    },
    {
        formula: 'BN', name: 'Boron nitride', flavor: 'A boron-nitrogen material with forms that resemble graphite and diamond.', rarity: 'Uncommon'
    },
    {
        formula: 'B2O3', name: 'Boron trioxide', flavor: 'A glass-forming oxide that helps make heat-resistant borosilicate glass.', rarity: 'Legendary'
    },
    {
        formula: 'H3BO3', name: 'Boric acid', flavor: 'A mild acid used in glassmaking and some specialised applications.', rarity: 'Legendary'
    },
    {
        formula: 'CH2O', name: 'Formaldehyde', flavor: 'A simple carbonyl compound used to make resins and preserve specimens.', rarity: 'Uncommon'
    },
    {
        formula: 'CH2O2', name: 'Formic acid', flavor: 'The acid found in ant venom and nettles, with a sharp sting.', rarity: 'Uncommon'
    },
    {
        formula: 'H2CO3', name: 'Carbonic acid', flavor: 'Formed when carbon dioxide dissolves in water, it helps give fizzy drinks their bite.', rarity: 'Rare'
    },
    {
        formula: 'HClO', name: 'Hypochlorous acid', flavor: 'A weak, fast-acting disinfectant that your own white blood cells make.', rarity: 'Common'
    },
    {
        formula: 'NaClO', name: 'Sodium hypochlorite', flavor: 'The active ingredient in household bleach.', rarity: 'Epic'
    },
    {
        formula: 'CaSO4', name: 'Calcium sulfate', flavor: 'The mineral behind gypsum, plaster and drywall.', rarity: 'Legendary'
    },
    {
        formula: 'MgCl2', name: 'Magnesium chloride', flavor: 'A salt found in seawater, used for de-icing and tofu making.', rarity: 'Epic'
    },
    {
        formula: 'FeS2', name: 'Pyrite', flavor: "Fool's gold: a brassy iron sulfide that sparks when struck.", rarity: 'Epic'
    },
    {
        formula: 'Cu2O', name: 'Cuprite', flavor: 'A deep red copper ore with a mirror-like shine.', rarity: 'Rare'
    },
    {
        formula: 'CuO', name: 'Copper oxide', flavor: 'A black oxide that tints glazes and glass blue-green.', rarity: 'Common'
    },
    {
        formula: 'ZnS', name: 'Zinc sulfide', flavor: 'A glow-in-the-dark phosphor and the main ore of zinc.', rarity: 'Uncommon'
    },
    {
        formula: 'HgS', name: 'Cinnabar', flavor: 'A vivid red mercury ore once ground into pigment.', rarity: 'Uncommon'
    },
    {
        formula: 'Ag2S', name: 'Silver sulfide', flavor: 'The dark tarnish that forms on silver.', rarity: 'Epic'
    },
    {
        formula: 'AgBr', name: 'Silver bromide', flavor: 'A light-sensitive crystal used in classic photographic film.', rarity: 'Rare'
    },
    {
        formula: 'Li2O', name: 'Lithium oxide', flavor: 'A lithium compound used in specialised ceramics and glass.', rarity: 'Rare'
    },
    {
        formula: 'LiOH', name: 'Lithium hydroxide', flavor: 'A strong base used in batteries and to scrub CO2 in spacecraft.', rarity: 'Common'
    },
    {
        formula: 'MnO2', name: 'Manganese dioxide', flavor: 'A dark mineral used in dry-cell batteries.', rarity: 'Uncommon'
    },
    {
        formula: 'WO3', name: 'Tungsten trioxide', flavor: 'A yellow oxide used in smart-glass coatings.', rarity: 'Rare'
    },
    {
        formula: 'ZrO2', name: 'Zirconia', flavor: 'The tough ceramic behind cubic zirconia gemstones.', rarity: 'Rare'
    },
    {
        formula: 'CS2', name: 'Carbon disulfide', flavor: 'A smelly, volatile solvent used in making rayon.', rarity: 'Rare'
    },
    {
        formula: 'CH4O', name: 'Methanol', flavor: 'The simplest alcohol, used as a solvent and fuel.', rarity: 'Epic'
    },
    {
        formula: 'PH3', name: 'Phosphine', flavor: 'A toxic, garlicky-smelling gas of phosphorus and hydrogen.', rarity: 'Rare'
    },
    {
        formula: 'PbO', name: 'Lead oxide', flavor: 'Litharge: a yellow oxide used in glass and old batteries.', rarity: 'Common'
    },
    {
        formula: 'SnCl2', name: 'Tin(II) chloride', flavor: 'A reducing agent used in labs and mirror making.', rarity: 'Legendary'
    },
    {
        formula: 'CdS', name: 'Cadmium sulfide', flavor: "A bright yellow pigment famous in artists' paint.", rarity: 'Rare'
    },
    {
        formula: 'BaO', name: 'Barium oxide', flavor: 'A reactive oxide used in glass and cathode coatings.', rarity: 'Uncommon'
    },
    {
        formula: 'SrO', name: 'Strontium oxide', flavor: 'A strontium compound used in specialised glass and ceramics.', rarity: 'Uncommon'
    },
    {
        formula: 'CsCl', name: 'Caesium chloride', flavor: 'A dense salt used to separate DNA by centrifuge.', rarity: 'Epic'
    },
    {
        formula: 'NaI', name: 'Sodium iodide', flavor: 'A salt used in iodised supplements and radiation detectors.', rarity: 'Epic'
    },
    {
        formula: 'KF', name: 'Potassium fluoride', flavor: 'A fluoride salt used in chemical synthesis.', rarity: 'Epic'
    },
    {
        formula: 'GeO2', name: 'Germanium dioxide', flavor: 'A clear oxide used in optical fibres.', rarity: 'Rare'
    },
    {
        formula: 'NiO', name: 'Nickel oxide', flavor: 'A green-grey oxide used in batteries and ceramics.', rarity: 'Common'
    },
    {
        formula: 'CoO', name: 'Cobalt oxide', flavor: 'The classic source of cobalt blue in glass and glazes.', rarity: 'Uncommon'
    },
    {
        formula: 'LiF', name: 'Lithium fluoride', flavor: 'A crystal that is transparent to ultraviolet light.', rarity: 'Uncommon'
    },
    {
        formula: 'AgI', name: 'Silver iodide', flavor: 'A crystal used in cloud-seeding experiments.', rarity: 'Rare'
    },
    {
        formula: 'PtO2', name: 'Platinum dioxide', flavor: "Adams' catalyst, used for hydrogenation reactions.", rarity: 'Uncommon'
    },
    {
        formula: 'ThO2', name: 'Thorium dioxide', flavor: 'One of the most heat-resistant oxides known.', rarity: 'Rare'
    },
    {
        formula: 'IrO2', name: 'Iridium dioxide', flavor: 'A durable catalyst used in electrolysis.', rarity: 'Rare'
    },
    {
        formula: 'NaH', name: 'Sodium hydride', flavor: 'A reactive hydride used as a strong base in synthesis.', rarity: 'Uncommon'
    },
    {
        formula: 'CaH2', name: 'Calcium hydride', flavor: 'A drying agent that reacts vigorously with water.', rarity: 'Uncommon'
    },
    {
        formula: 'LiH', name: 'Lithium hydride', flavor: 'A compact hydrogen store used in specialised chemistry.', rarity: 'Common'
    },
    {
        formula: 'MgF2', name: 'Magnesium fluoride', flavor: 'A crystal used in lens coatings and ultraviolet optics.', rarity: 'Legendary'
    },
    {
        formula: 'CaC2', name: 'Calcium carbide', flavor: 'Reacts with water to release acetylene gas.', rarity: 'Rare'
    },
    {
        formula: 'FeO', name: 'Wustite', flavor: 'A black iron oxide found in steelmaking.', rarity: 'Common'
    }
];
let unlockedAchievements = [];
try {
    unlockedAchievements = JSON.parse(localStorage.getItem('elementalAchievements') || '[]');
} catch (e) {
    unlockedAchievements = [];
}
let toastTimer;
const EFFECT_DEFAULTS = {
    1: true, 2: true, 3: true, 4: true, 5: true, 6: true, 7: true, 8: true, 9: true, 10: true, 11: true, 12: true
};
let rarityEffects = { ...EFFECT_DEFAULTS };
try {
    const stored = JSON.parse(localStorage.getItem('elementalRarityEffects') || 'null');
    if (stored && typeof stored === 'object') {
        rarityEffects = { ...EFFECT_DEFAULTS, ...stored };
    }
} catch (e) { }
function syncEffectSettings() {
    document.querySelectorAll('[data-effect-tier]').forEach(input => {
        input.checked = rarityEffects[input.dataset.effectTier] !== false;
    });
}
document.querySelectorAll('[data-effect-tier]').forEach(input => input.addEventListener('change', () => {
    rarityEffects[input.dataset.effectTier] = input.checked;
    try {
        localStorage.setItem('elementalRarityEffects', JSON.stringify(rarityEffects));
    } catch (e) { }
}));
const $ = id => document.getElementById(id);
const INITIAL_RESULT = $('rollResults').innerHTML;
let audioContext = null;
let tickTimer = null;
let tickIndex = 0;
const soundTierDefaults = {
    1: true, 2: true, 3: true, 4: true, 5: true, 6: true, 7: true, 8: true, 9: true, 10: true, 11: true, 12: true
};
let soundTiers = { ...soundTierDefaults };
try {
    const saved = JSON.parse(localStorage.getItem('elementalSoundTiers') || 'null');
    if (saved && typeof saved === 'object') {
        soundTiers = { ...soundTierDefaults, ...saved };
    }
} catch (e) { }
try {
    $('audioEnabled').checked = localStorage.getItem('elementalAudioEnabled') !== 'false';
} catch (e) { }
function prepareAudio() {
    if (!$('audioEnabled').checked) {
        return null;
    }
    try {
        const Ctx = window.AudioContext || window.webkitAudioContext;
        if (!Ctx) {
            return null;
        }
        if (!audioContext) {
            audioContext = new Ctx();
        }
        if (audioContext.state === 'suspended') {
            audioContext.resume();
        }
        return audioContext;
    } catch (e) {
        return null;
    }
}
function tone(freq, when, duration, volume, type = 'sine', endFreq = null) {
    const ctx = prepareAudio();
    if (!ctx) {
        return;
    }
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, when);
    if (endFreq) {
        osc.frequency.exponentialRampToValueAtTime(Math.max(1, endFreq), when + duration);
    }
    gain.gain.setValueAtTime(0.0001, when);
    gain.gain.exponentialRampToValueAtTime(Math.max(0.0002, volume), when + Math.min(0.018, duration * 0.25));
    gain.gain.exponentialRampToValueAtTime(0.0001, when + duration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(when);
    osc.stop(when + duration + 0.03);
}
function startRollTicks() {
    stopRollTicks();
    if (!$('audioEnabled').checked) {
        return;
    }
    tickIndex = 0;
    prepareAudio();
    tickTimer = setInterval(() => {
        const ctx = prepareAudio();
        if (!ctx) {
            return;
        }
        const now = ctx.currentTime;
        const pitch = [1450, 1180, 1320, 1550][tickIndex++ % 4];
        tone(pitch, now, 0.035, 0.012, 'triangle', pitch * 0.72);
    }, 115);
}
function stopRollTicks() {
    if (tickTimer) {
        clearInterval(tickTimer);
        tickTimer = null;
    }
}
// Tier 1 starts at 1 in 10,000 and each tier is ten times rarer, up to tier 9 at 1 in a trillion
const TIER_SCORES = [10000, 30000, 100000, 250000, 500000, 1000000, 1500000, 3000000, 12000000, 30000000, 100000000, 300000000];
function getRarityTier(score) {
    let t = 0;
    TIER_SCORES.forEach((min, i) => {
        if (score >= min) {
            t = i + 1;
        }
    });
    return t;
}
function getSfxBus(ctx) {
    if (ctx._bus) {
        return ctx._bus;
    }
    const comp = ctx.createDynamicsCompressor();
    comp.threshold.value = -18;
    comp.knee.value = 20;
    comp.ratio.value = 6;
    comp.attack.value = 0.004;
    comp.release.value = 0.25;
    const master = ctx.createGain();
    master.gain.value = 0.9;
    master.connect(comp);
    comp.connect(ctx.destination);
    const length = Math.floor(ctx.sampleRate * 3.2);
    const impulse = ctx.createBuffer(2, length, ctx.sampleRate);
    for (let c = 0; c < 2; c++) {
        const d = impulse.getChannelData(c);
        for (let i = 0; i < length; i++) {
            d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, 2.6);
        }
    }
    const conv = ctx.createConvolver();
    conv.buffer = impulse;
    const wet = ctx.createGain();
    wet.gain.value = 0.55;
    conv.connect(wet);
    wet.connect(master);
    const noiseBuffer = ctx.createBuffer(1, ctx.sampleRate * 4, ctx.sampleRate);
    const noiseData = noiseBuffer.getChannelData(0);
    for (let i = 0; i < noiseData.length; i++) {
        noiseData[i] = Math.random() * 2 - 1;
    }
    return ctx._bus = { master, conv, nb: noiseBuffer };
}
function routeOut(ctx, node, wet) {
    const bus = getSfxBus(ctx);
    node.connect(bus.master);
    if (wet > 0) {
        const send = ctx.createGain();
        send.gain.value = wet;
        node.connect(send);
        send.connect(bus.conv);
    }
}
function playTone(ctx, freq, when, duration, volume, type = 'sine', endFreq = null, wet = 0.3, detune = 0, attack = 0.02) {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.detune.value = detune;
    osc.frequency.setValueAtTime(freq, when);
    if (endFreq) {
        osc.frequency.exponentialRampToValueAtTime(Math.max(1, endFreq), when + duration);
    }
    gain.gain.setValueAtTime(0.0001, when);
    gain.gain.exponentialRampToValueAtTime(Math.max(0.0002, volume), when + Math.min(attack, duration * 0.4));
    gain.gain.exponentialRampToValueAtTime(0.0001, when + duration);
    osc.connect(gain);
    routeOut(ctx, gain, wet);
    osc.start(when);
    osc.stop(when + duration + 0.05);
}
function playNoise(ctx, when, duration, volume, startFreq, endFreq, type = 'lowpass', resonance = 1, wet = 0.2, attack = 0.01) {
    const bus = getSfxBus(ctx);
    const source = ctx.createBufferSource();
    const filter = ctx.createBiquadFilter();
    const gain = ctx.createGain();
    source.buffer = bus.nb;
    source.loop = true;
    filter.type = type;
    filter.Q.value = resonance;
    filter.frequency.setValueAtTime(startFreq, when);
    filter.frequency.exponentialRampToValueAtTime(Math.max(20, endFreq), when + duration);
    gain.gain.setValueAtTime(0.0001, when);
    gain.gain.exponentialRampToValueAtTime(Math.max(0.0002, volume), when + Math.min(attack, duration * 0.4));
    gain.gain.exponentialRampToValueAtTime(0.0001, when + duration);
    source.connect(filter);
    filter.connect(gain);
    routeOut(ctx, gain, wet);
    source.start(when, Math.random() * 2);
    source.stop(when + duration + 0.05);
}
function boom(ctx, when, volume, length = 1.4) {
    playTone(ctx, 110, when, length, volume, 'sine', 26, 0.25, 0, 0.006);
    playTone(ctx, 55, when, length * 1.2, volume * 0.8, 'sine', 22, 0.2, 0, 0.006);
    playNoise(ctx, when, length * 0.5, volume * 0.9, 900, 60, 'lowpass', 0.8, 0.35, 0.004);
}
function riser(ctx, when, duration, volume, startFreq, endFreq) {
    const osc = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const filter = ctx.createBiquadFilter();
    const gain = ctx.createGain();
    osc.type = 'sawtooth';
    osc2.type = 'sawtooth';
    osc2.detune.value = 14;
    filter.type = 'lowpass';
    filter.Q.value = 3;
    osc.frequency.setValueAtTime(startFreq, when);
    osc.frequency.exponentialRampToValueAtTime(endFreq, when + duration);
    osc2.frequency.setValueAtTime(startFreq * 1.005, when);
    osc2.frequency.exponentialRampToValueAtTime(endFreq * 1.005, when + duration);
    filter.frequency.setValueAtTime(startFreq * 2, when);
    filter.frequency.exponentialRampToValueAtTime(endFreq * 5, when + duration);
    gain.gain.setValueAtTime(0.0001, when);
    gain.gain.exponentialRampToValueAtTime(volume, when + duration * 0.96);
    gain.gain.linearRampToValueAtTime(0, when + duration);
    osc.connect(filter);
    osc2.connect(filter);
    filter.connect(gain);
    routeOut(ctx, gain, 0.25);
    osc.start(when);
    osc2.start(when);
    osc.stop(when + duration + 0.05);
    osc2.stop(when + duration + 0.05);
    playNoise(ctx, when, duration, volume * 0.7, 500, 9000, 'bandpass', 2, 0.3, duration * 0.8);
}
function padChord(ctx, when, notes, duration, volume, type = 'sawtooth', cutoff = 2400) {
    notes.forEach(n => [-9, 0, 9].forEach(d => {
        const o = ctx.createOscillator();
        const f = ctx.createBiquadFilter();
        const g = ctx.createGain();
        o.type = type;
        o.detune.value = d;
        o.frequency.value = n;
        f.type = 'lowpass';
        f.frequency.setValueAtTime(300, when);
        f.frequency.exponentialRampToValueAtTime(cutoff, when + duration * 0.3);
        f.frequency.exponentialRampToValueAtTime(400, when + duration);
        g.gain.setValueAtTime(0.0001, when);
        g.gain.exponentialRampToValueAtTime(volume, when + 0.12);
        g.gain.exponentialRampToValueAtTime(0.0001, when + duration);
        o.connect(f);
        f.connect(g);
        routeOut(ctx, g, 0.45);
        o.start(when);
        o.stop(when + duration + 0.05);
    }));
}
function sparkle(ctx, when, count, span, volume, scale) {
    const base = scale || [1046.5, 1174.66, 1318.51, 1567.98, 1760, 2093, 2349.32, 2637.02, 3135.96];
    for (let i = 0; i < count; i++) {
        const t = when + Math.random() * span;
        const f = base[Math.random() * base.length | 0];
        playTone(ctx, f, t, 0.5 + Math.random() * 0.7, volume * (0.5 + Math.random() * 0.7), 'sine', null, 0.6, 0, 0.004);
    }
}
function arp(ctx, when, notes, step, volume, type = 'triangle') {
    notes.forEach((f, i) => playTone(ctx, f, when + i * step, 0.7, volume, type, null, 0.45, 0, 0.008));
}
// secret (dark) sounds: no chimes, nothing in tune
// breaking glass: a hard crack, then a spray of inharmonic shards and falling debris
function glassBreak(ctx, when, vol, size) {
    playNoise(ctx, when, 0.08, vol * 1.4, 12000, 3000, 'highpass', 0.8, 0.3, 0.001);
    playNoise(ctx, when, 0.35, vol * 0.8, 6000, 900, 'bandpass', 1.5, 0.4, 0.002);
    const n = Math.round(18 * size);
    for (let i = 0; i < n; i++) {
        const t = when + Math.pow(Math.random(), 1.8) * (0.25 + size * 0.5);
        const f = 2200 + Math.random() * 7000;
        playTone(ctx, f, t, 0.05 + Math.random() * 0.2, vol * (0.12 + Math.random() * 0.25), Math.random() < 0.5 ? 'triangle' : 'sine', f * (0.9 + Math.random() * 0.15), 0.5, 0, 0.001);
    }
    for (let i = 0; i < n; i++) {
        playNoise(ctx, when + 0.1 + Math.random() * (0.6 + size), 0.02 + Math.random() * 0.05, vol * (0.15 + Math.random() * 0.3), 5000 + Math.random() * 6000, 2500, 'highpass', 1.5, 0.35, 0.001);
    }
}
// a slow, out-of-tune drone of detuned saws behind a dark filter
function dread(ctx, when, notes, dur, vol, cutoff) {
    notes.forEach(f => [-23, 0, 17].forEach(d => {
        const o = ctx.createOscillator();
        const fl = ctx.createBiquadFilter();
        const g = ctx.createGain();
        o.type = 'sawtooth';
        o.frequency.value = f;
        o.detune.value = d;
        fl.type = 'lowpass';
        fl.Q.value = 4;
        fl.frequency.setValueAtTime(cutoff * 0.3, when);
        fl.frequency.exponentialRampToValueAtTime(cutoff, when + dur * 0.4);
        fl.frequency.exponentialRampToValueAtTime(cutoff * 0.25, when + dur);
        g.gain.setValueAtTime(0.0001, when);
        g.gain.exponentialRampToValueAtTime(vol, when + Math.min(0.6, dur * 0.3));
        g.gain.exponentialRampToValueAtTime(0.0001, when + dur);
        o.connect(fl);
        fl.connect(g);
        routeOut(ctx, g, 0.5);
        o.start(when);
        o.stop(when + dur + 0.05);
    }));
}
// noise that swells up and is cut dead (like a reversed cymbal)
function swellCut(ctx, when, dur, vol, lo, hi) {
    const bus = getSfxBus(ctx);
    const s = ctx.createBufferSource();
    const f = ctx.createBiquadFilter();
    const g = ctx.createGain();
    s.buffer = bus.nb;
    s.loop = true;
    f.type = 'bandpass';
    f.Q.value = 1.2;
    f.frequency.setValueAtTime(lo, when);
    f.frequency.exponentialRampToValueAtTime(hi, when + dur);
    g.gain.setValueAtTime(0.0001, when);
    g.gain.exponentialRampToValueAtTime(vol, when + dur);
    g.gain.setValueAtTime(0, when + dur + 0.005);
    s.connect(f);
    f.connect(g);
    g.connect(bus.master);
    s.start(when, Math.random() * 2);
    s.stop(when + dur + 0.05);
}
// a heavy, dull double heartbeat
function heartbeat(ctx, when, vol) {
    playTone(ctx, 62, when, 0.32, vol, 'sine', 34, 0.15, 0, 0.004);
    playNoise(ctx, when, 0.12, vol * 0.5, 300, 60, 'lowpass', 1, 0.1, 0.003);
    playTone(ctx, 54, when + 0.2, 0.38, vol * 0.8, 'sine', 30, 0.15, 0, 0.004);
}
// metal dragged across metal
function scrape(ctx, when, dur, vol, from, to) {
    playNoise(ctx, when, dur, vol, from, to, 'bandpass', 14, 0.45, dur * 0.3);
    playTone(ctx, from * 0.5, when, dur, vol * 0.15, 'sawtooth', to * 0.5, 0.4, 31, dur * 0.3);
}
// an inharmonic toll, like a cracked bell
function toll(ctx, when, f, vol, dur) {
    [1, 2.31, 2.76, 4.07, 5.43].forEach((r, i) => playTone(ctx, f * r, when, dur * (1 - i * 0.12), vol / (1 + i * 0.7), 'sine', f * r * 0.985, 0.7, 0, 0.003));
}
function darkSound(ctx, start, tier) {
    const S = start;
    if (tier === 5) {
        boom(ctx, S, 0.45, 1.6);
        glassBreak(ctx, S + 0.06, 0.09, 0.8);
        dread(ctx, S, [65.41, 69.3, 92.5], 3.6, 0.018, 700);
        playTone(ctx, 220, S + 0.25, 2.8, 0.03, 'sawtooth', 98, 0.5, 0, 0.3);
        playTone(ctx, 233.08, S + 0.25, 2.8, 0.025, 'sawtooth', 103.8, 0.5, 0, 0.3);
        for (let i = 0; i < 10; i++) {
            playNoise(ctx, S + Math.random() * 1.1, 0.03, 0.07, 3000, 800, 'bandpass', 3, 0.1, 0.001);
        }
        toll(ctx, S + 0.4, 98, 0.035, 3);
    } else if (tier === 6) {
        playTone(ctx, 40, S, 0.25, 0.0002, 'sine');
        const R = S + 0.15;
        boom(ctx, R, 0.7, 2.2);
        boom(ctx, R + 0.03, 0.4, 1.6);
        glassBreak(ctx, R, 0.13, 1.4);
        playTone(ctx, 90, R, 3.2, 0.12, 'sine', 24, 0.3, 0, 0.01);
        dread(ctx, R, [55, 58.27, 77.78, 82.41], 4.6, 0.016, 900);
        scrape(ctx, R + 0.4, 2.6, 0.08, 3200, 400);
        toll(ctx, R + 0.2, 73.4, 0.05, 4);
    } else if (tier === 7) {
        boom(ctx, S, 0.5, 1.2);
        glassBreak(ctx, S, 0.08, 0.7);
        const R = S + 0.34;
        boom(ctx, R, 0.75, 2.2);
        glassBreak(ctx, R, 0.13, 1.5);
        for (let i = 0; i < 26; i++) {
            const t = R + 0.05 + Math.random() * 1.5;
            playTone(ctx, 80 + Math.random() * 1400, t, 0.03 + Math.random() * 0.06, 0.03, 'square', null, 0.05, 0, 0.001);
        }
        for (let i = 0; i < 14; i++) {
            playNoise(ctx, R + Math.random() * 1.6, 0.04, 0.09, 8000, 2000, 'highpass', 1, 0.05, 0.001);
        }
        dread(ctx, R, [61.74, 65.41, 87.31, 92.5], 5, 0.016, 1100);
        playTone(ctx, 466, R + 0.2, 4, 0.025, 'sawtooth', 58, 0.5, 0, 0.5);
        playTone(ctx, 440, R + 0.2, 4, 0.025, 'sawtooth', 55, 0.5, 0, 0.5);
        swellCut(ctx, S + 0.8, 1.1, 0.12, 400, 7000);
        boom(ctx, S + 1.9, 0.55, 1.8);
        toll(ctx, S + 1.9, 61.7, 0.05, 4);
    } else if (tier === 8) {
        const v = 2.4;
        const hb = RARITY_DARK[8].hb;
        hb.forEach((ms, i) => heartbeat(ctx, S + ms / 1000, 0.18 + i * 0.05));
        dread(ctx, S, [49, 51.91, 69.3], v + 0.6, 0.014, 600);
        playTone(ctx, 900, S, v, 0.025, 'sawtooth', 60, 0.4, 0, v * 0.7);
        playTone(ctx, 950, S, v, 0.02, 'sawtooth', 63, 0.4, 0, v * 0.7);
        swellCut(ctx, S + v - 1.2, 1.4, 0.2, 300, 9000);
        const R = S + v + 0.2;
        boom(ctx, R, 1, 3.2);
        boom(ctx, R + 0.03, 0.7, 2.4);
        glassBreak(ctx, R, 0.18, 2.2);
        playTone(ctx, 80, R, 4, 0.16, 'sine', 20, 0.3, 0, 0.01);
        dread(ctx, R, [36.71, 38.89, 51.91, 55, 77.78, 155.56], 6, 0.016, 1400);
        scrape(ctx, R + 0.3, 3.4, 0.1, 4500, 300);
        toll(ctx, R + 0.5, 55, 0.07, 5);
        boom(ctx, R + 2.8, 0.4, 2.4);
    } else if (tier === 9) {
        const v = 4.32;
        const hb = RARITY_DARK[9].hb;
        hb.forEach((ms, i) => heartbeat(ctx, S + ms / 1000, 0.16 + i * 0.035));
        dread(ctx, S, [41.2, 43.65, 58.27], v + 0.4, 0.012, 500);
        dread(ctx, S + 1.5, [82.41, 87.31, 116.54], v - 1.1, 0.01, 1200);
        for (let i = 0; i < 3; i++) {
            playNoise(ctx, S + 0.5 + i * 1.2, 1.4, 0.05, 300 + i * 120, 900 + i * 200, 'bandpass', 9, 0.6, 0.6);
        }
        playTone(ctx, 1200, S + 0.8, v - 0.8, 0.018, 'sawtooth', 70, 0.4, 0, v * 0.6);
        playTone(ctx, 1290, S + 0.8, v - 0.8, 0.016, 'sawtooth', 74, 0.4, 0, v * 0.6);
        swellCut(ctx, S + v - 1.8, 1.8, 0.24, 200, 11000);
        const R = S + v;
        boom(ctx, R, 1, 4);
        boom(ctx, R + 0.03, 0.8, 3.2);
        boom(ctx, R + 0.4, 0.6, 2.6);
        glassBreak(ctx, R, 0.22, 3);
        for (let i = 0; i < 40; i++) {
            const t = R + 0.65 + Math.random() * 1.8;
            const f = 1500 + Math.random() * 6000;
            playTone(ctx, f, t, 0.06 + Math.random() * 0.15, 0.03 + Math.random() * 0.04, 'triangle', f * 0.8, 0.5, 0, 0.001);
        }
        playTone(ctx, 70, R, 5, 0.2, 'sine', 18, 0.3, 0, 0.01);
        dread(ctx, R + 0.9, [32.7, 34.65, 46.25, 98, 138.59, 293.66, 415.3], 7, 0.014, 1800);
        scrape(ctx, R + 0.9, 4, 0.12, 6000, 250);
        toll(ctx, R + 1, 41.2, 0.09, 6);
        toll(ctx, R + 4.2, 38.9, 0.06, 5);
        boom(ctx, R + 4.2, 0.45, 3);
    } else if (tier === 10) {
        // failed supernova
        const v = 3.6;
        RARITY_DARK[10].hb.forEach((ms, i) => {
            heartbeat(ctx, S + ms / 1000, 0.16 + i * 0.03);
            playTone(ctx, 233.08 + i * 41, S + ms / 1000, 0.5, 0.02, 'sawtooth', 220 + i * 33, 0.4, 0, 0.01);
        });
        dread(ctx, S, [46.25, 49, 65.41], v + 0.4, 0.014, 600);
        playTone(ctx, 60, S, v, 0.1, 'sine', 140, 0.3, 0, v * 0.7);
        swellCut(ctx, S + v - 1.5, 1.5, 0.24, 9000, 200);
        const R = S + v + 0.3;
        glassBreak(ctx, R, 0.2, 2.6);
        boom(ctx, R, 0.7, 2.4);
        playTone(ctx, 300, R, 3, 0.05, 'sawtooth', 30, 0.4, 0, 0.02);
        playTone(ctx, 318, R, 3, 0.045, 'sawtooth', 31, 0.4, 0, 0.02);
        dread(ctx, R + 0.4, [34.65, 36.71, 48.99, 103.83, 146.83, 207.65], 6.5, 0.014, 1500);
        scrape(ctx, R + 0.6, 3.6, 0.12, 5200, 260);
        toll(ctx, R + 0.8, 46.25, 0.08, 6);
        toll(ctx, R + 3.8, 43.65, 0.06, 5);
    } else if (tier === 11) {
        // black hole, wrong page
        const v = 4.6;
        playTone(ctx, 700, S, v, 0.035, 'sawtooth', 28, 0.4, 0, v * 0.3);
        playTone(ctx, 742, S, v, 0.03, 'sawtooth', 29, 0.4, 0, v * 0.3);
        RARITY_DARK[11].hb.forEach((ms, i) => heartbeat(ctx, S + ms / 1000, 0.14 + i * 0.03));
        dread(ctx, S, [36.71, 38.89, 51.91], v + 1.8, 0.013, 500);
        for (let i = 0; i < 70; i++) {
            playNoise(ctx, S + v + Math.random() * 1.6, 0.01 + Math.random() * 0.03, 0.04 + Math.random() * 0.06, 2000 + Math.random() * 8000, 800, 'bandpass', 2, 0.1, 0.001);
        }
        const R = S + v + 1.75;
        boom(ctx, R, 0.85, 3);
        glassBreak(ctx, R, 0.16, 2.2);
        playTone(ctx, 466.16, R, 4.5, 0.03, 'sawtooth', 440, 0.5, 0, 0.02);
        playTone(ctx, 493.88, R, 4.5, 0.03, 'sawtooth', 466.16, 0.5, 0, 0.02);
        playTone(ctx, 311.13, R, 4.5, 0.03, 'sawtooth', 293.66, 0.5, 0, 0.02);
        dread(ctx, R + 0.3, [32.7, 34.65, 46.25, 92.5, 138.59, 185], 6, 0.014, 1400);
        toll(ctx, R + 0.4, 38.89, 0.08, 6);
        scrape(ctx, R + 1.4, 3, 0.1, 3800, 300);
    } else if (tier === 12) {
        // heat death
        const v = 5.6;
        RARITY_DARK[12].hb.forEach((ms, i, a) => {
            heartbeat(ctx, S + ms / 1000, 0.22 - i * 0.03);
            playTone(ctx, 220 - i * 26, S + ms / 1000, 1.4, 0.02, 'triangle', 200 - i * 26, 0.6, 0, 0.05);
        });
        playTone(ctx, 130.81, S, v, 0.05, 'sawtooth', 32, 0.5, 0, 1);
        playNoise(ctx, S, v, 0.06, 1200, 90, 'lowpass', 2, 0.5, v * 0.3);
        toll(ctx, S + v - 0.4, 32.7, 0.1, 6);
        const R = S + v + 1.5;
        dread(ctx, R + 0.5, [41.2, 43.65, 61.74, 87.31, 116.54], 6, 0.01, 900);
        for (let i = 0; i < 16; i++) {
            playNoise(ctx, R + Math.random() * 5, 0.04, 0.03, 2400, 600, 'bandpass', 3, 0.1, 0.002);
        }
        playTone(ctx, 1046.5, R + 2.5, 4, 0.012, 'sine', 1040, 0.9, 0, 1.2);
    }
}
function bigSound(ctx, start, tier) {
    if (tier === 6) {
        boom(ctx, start, 0.55, 1.6);
        playNoise(ctx, start, 1.4, 0.1, 200, 7000, 'highpass', 0.7, 0.4, 0.5);
        padChord(ctx, start + 0.05, [196, 293.66, 392, 587.33, 783.99], 2.8, 0.012, 'sawtooth', 2600);
        arp(ctx, start + 0.15, [392, 493.88, 587.33, 783.99, 987.77, 1174.66, 1567.98, 1975.53], 0.075, 0.05);
        sparkle(ctx, start + 0.7, 16, 1.8, 0.025);
        playNoise(ctx, start, 4.6, 0.05, 500, 180, 'lowpass', 0.8, 0.2, 0.4);
        for (let i = 0; i < 34; i++) {
            playNoise(ctx, start + 0.2 + Math.random() * 4.2, 0.03 + Math.random() * 0.05, 0.05 + Math.random() * 0.06, 4000 + Math.random() * 5000, 900, 'highpass', 1, 0.2, 0.002);
        }
        [1567.98, 2349.32].forEach((f, i) => playTone(ctx, f, start + 0.9 + i * 0.12, 2.2, 0.03, 'sine', null, 0.7));
    } else if (tier === 7) {
        boom(ctx, start, 0.65, 1.8);
        boom(ctx, start + 0.34, 0.5, 1.4);
        playNoise(ctx, start, 1.3, 0.12, 7000, 150, 'bandpass', 3, 0.3, 0.02);
        for (let i = 0; i < 9; i++) {
            playTone(ctx, [440, 311, 622, 233, 880, 349, 740, 277, 555][i], start + 0.45 + i * 0.055, 0.045, 0.035, 'square', null, 0.1, 0, 0.002);
        }
        playTone(ctx, 880, start, 2.4, 0.03, 'sawtooth', 110, 0.4, 25, 0.01);
        playTone(ctx, 622.25, start, 2.4, 0.022, 'sawtooth', 77.8, 0.4, -25, 0.01);
        padChord(ctx, start + 0.9, [146.83, 220, 261.63, 329.63, 440], 3.4, 0.012, 'sawtooth', 1900);
        arp(ctx, start + 1.0, [293.66, 349.23, 440, 523.25, 659.25, 880, 1046.5], 0.1, 0.04, 'sawtooth');
        sparkle(ctx, start + 1.2, 16, 2.2, 0.022, [1174.66, 1396.91, 1760, 2093]);
        for (let i = 0; i < 6; i++) {
            playNoise(ctx, start + 0.05 + i * 0.1, 0.07, 0.08, 9000, 3000, 'highpass', 2, 0.2, 0.001);
        }
        playNoise(ctx, start + 1.5, 1.0, 0.16, 13000, 2500, 'highpass', 1, 0.5, 0.002);
        sparkle(ctx, start + 1.5, 26, 2.4, 0.03, [2093, 2637.02, 3135.96, 3951, 4186]);
    } else if (tier === 8) {
        const v = 2.4;
        playTone(ctx, 140, start, v, 0.14, 'sine', 24, 0.3, 0, 0.4);
        playTone(ctx, 70, start, v, 0.12, 'sine', 18, 0.3, 0, 0.4);
        playNoise(ctx, start, v, 0.14, 320, 70, 'lowpass', 2, 0.3, 0.6);
        riser(ctx, start + 0.1, v - 0.1, 0.06, 90, 1400);
        [0.5, 1.05, 1.5, 1.85, 2.1].forEach((d, i) => boom(ctx, start + d, 0.1 + i * 0.05, 0.5));
        const R = start + v;
        boom(ctx, R, 0.95, 3);
        boom(ctx, R + 0.02, 0.6, 2);
        playNoise(ctx, R, 2.2, 0.3, 9000, 300, 'highpass', 0.7, 0.5, 0.003);
        padChord(ctx, R, [130.81, 196, 261.63, 392, 523.25, 783.99], 5, 0.014, 'sawtooth', 3200);
        arp(ctx, R + 0.05, [261.63, 329.63, 392, 523.25, 659.25, 783.99, 1046.5, 1318.51, 1567.98, 2093], 0.07, 0.055);
        [1046.5, 1318.51, 1567.98, 2093, 2637.02].forEach((f, i) => playTone(ctx, f, R + 0.1 + i * 0.1, 3.4, 0.035, 'sine', null, 0.8, 3, 0.01));
        sparkle(ctx, R + 0.3, 30, 3.2, 0.03);
    } else if (tier === 9) {
        const v = 4.2;
        [0, 0.9, 1.7, 2.4, 3, 3.5, 3.9].forEach((d, i) => {
            boom(ctx, start + d, 0.16 + i * 0.04, 0.7);
            boom(ctx, start + d + 0.16, 0.1 + i * 0.03, 0.5);
        });
        riser(ctx, start, v, 0.075, 70, 3200);
        playNoise(ctx, start + 0.5, v - 0.5, 0.12, 200, 10000, 'bandpass', 4, 0.4, v * 0.7);
        playTone(ctx, 60, start, v, 0.1, 'sine', 200, 0.3, 0, 1);
        const R = start + v + 0.12;
        boom(ctx, R, 1, 4);
        boom(ctx, R + 0.03, 0.8, 3.2);
        boom(ctx, R + 0.45, 0.6, 2.4);
        playNoise(ctx, R, 3, 0.38, 12000, 200, 'highpass', 0.7, 0.6, 0.003);
        padChord(ctx, R, [65.41, 130.81, 196, 261.63, 329.63, 392, 523.25, 659.25, 783.99], 7, 0.012, 'sawtooth', 4200);
        padChord(ctx, R + 0.3, [1046.5, 1318.51, 1567.98, 2093], 6, 0.01, 'triangle', 6000);
        arp(ctx, R + 0.05, [261.63, 329.63, 392, 523.25, 659.25, 783.99, 1046.5, 1318.51, 1567.98, 2093, 2637.02, 3135.96], 0.06, 0.06);
        arp(ctx, R + 1.0, [392, 523.25, 659.25, 783.99, 1046.5, 1318.51, 1567.98, 2093, 2637.02, 3135.96, 4186], 0.08, 0.045, 'sine');
        sparkle(ctx, R + 0.2, 60, 5.5, 0.035, [1046.5, 1318.51, 1567.98, 2093, 2637.02, 3135.96, 4186]);
        [2093, 3135.96, 4186].forEach((f, i) => playTone(ctx, f, R + 0.8 + i * 0.3, 5, 0.03, 'sine', f * 1.01, 0.9, 0, 0.05));
        playTone(ctx, 98, R + 3.2, 4, 0.07, 'sine', 49, 0.5, 0, 0.5);
        for (let i = 0; i < 9; i++) {
            playNoise(ctx, R + 0.05 + i * 0.09, 0.07, 0.08, 9000, 3000, 'highpass', 2, 0.2, 0.001);
        }
        playNoise(ctx, R + 1.7, 1.2, 0.2, 14000, 2500, 'highpass', 1, 0.6, 0.002);
        sparkle(ctx, R + 1.7, 36, 3, 0.03, [2093, 2637.02, 3135.96, 3951, 4186]);
        for (let i = 0; i < 40; i++) {
            playNoise(ctx, R + 0.3 + Math.random() * 5, 0.03 + Math.random() * 0.05, 0.04 + Math.random() * 0.05, 4000 + Math.random() * 5000, 900, 'highpass', 1, 0.2, 0.002);
        }
    } else if (tier === 10) {
        // supernova
        const v = 3.6;
        RARITY_FX[10].hb.forEach((ms, i) => {
            boom(ctx, start + ms / 1000, 0.14 + i * 0.05, 0.7);
            playTone(ctx, 220 + i * 60, start + ms / 1000, 0.5, 0.02 + i * 0.006, 'sine', 330 + i * 80, 0.6, 0, 0.01);
        });
        riser(ctx, start, v, 0.08, 60, 4200);
        playTone(ctx, 40, start, v, 0.14, 'sine', 160, 0.3, 0, v * 0.8);
        playNoise(ctx, start + 1, v - 1, 0.1, 300, 9000, 'bandpass', 3, 0.4, v * 0.6);
        const R = start + v;
        boom(ctx, R, 1, 4.5);
        boom(ctx, R + 0.03, 0.85, 3.6);
        boom(ctx, R + 0.5, 0.6, 3);
        playNoise(ctx, R, 3.4, 0.4, 13000, 160, 'highpass', 0.7, 0.6, 0.003);
        padChord(ctx, R, [73.42, 146.83, 220, 293.66, 369.99, 440, 587.33, 739.99, 880], 7.5, 0.013, 'sawtooth', 4600);
        padChord(ctx, R + 0.4, [1174.66, 1479.98, 1760, 2349.32], 6.5, 0.011, 'triangle', 7000);
        arp(ctx, R + 0.05, [293.66, 369.99, 440, 587.33, 739.99, 880, 1174.66, 1479.98, 1760, 2349.32, 2959.96], 0.055, 0.06);
        sparkle(ctx, R + 0.3, 70, 6, 0.034, [1174.66, 1479.98, 1760, 2349.32, 2959.96, 3520, 4698.63]);
        [2349.32, 2959.96, 3520].forEach((f, i) => playTone(ctx, f, R + 1 + i * 0.35, 5.5, 0.028, 'sine', f * 1.012, 0.9, 0, 0.05));
        playTone(ctx, 55, R + 2.5, 5, 0.09, 'sine', 36, 0.5, 0, 0.8);
    } else if (tier === 11) {
        // black hole into white hole
        const v = 4.6;
        playTone(ctx, 880, start, v, 0.035, 'sawtooth', 34, 0.4, 0, v * 0.3);
        playTone(ctx, 830, start, v, 0.03, 'sawtooth', 32, 0.4, 0, v * 0.3);
        playTone(ctx, 32, start, v + 0.3, 0.16, 'sine', 28, 0.3, 0, 1.5);
        RARITY_FX[11].hb.forEach((ms, i) => boom(ctx, start + ms / 1000, 0.12 + i * 0.05, 0.9));
        playNoise(ctx, start, v, 0.12, 2000, 80, 'lowpass', 3, 0.5, v * 0.5);
        swellCut(ctx, start + v - 1.6, 1.6, 0.26, 200, 12000);
        const R = start + v + 0.05;
        boom(ctx, R, 1, 4.6);
        boom(ctx, R + 0.03, 0.9, 3.8);
        boom(ctx, R + 0.45, 0.65, 3.2);
        playNoise(ctx, R, 3.6, 0.42, 14000, 150, 'highpass', 0.7, 0.6, 0.003);
        padChord(ctx, R, [82.41, 164.81, 246.94, 329.63, 415.3, 493.88, 659.25, 830.61, 987.77], 8, 0.013, 'sawtooth', 5000);
        padChord(ctx, R + 0.3, [1318.51, 1661.22, 1975.53, 2637.02], 7, 0.011, 'triangle', 7400);
        arp(ctx, R + 0.05, [329.63, 415.3, 493.88, 659.25, 830.61, 987.77, 1318.51, 1661.22, 1975.53, 2637.02, 3322.44], 0.05, 0.06);
        arp(ctx, R + 0.9, [3322.44, 2637.02, 1975.53, 1661.22, 1318.51, 987.77, 830.61, 659.25], 0.07, 0.04, 'sine');
        sparkle(ctx, R + 0.2, 80, 6.4, 0.034, [1318.51, 1661.22, 1975.53, 2637.02, 3322.44, 3951, 5274]);
        [2637.02, 3322.44, 3951].forEach((f, i) => playTone(ctx, f, R + 1.2 + i * 0.4, 6, 0.028, 'sine', f * 0.99, 0.9, 0, 0.05));
        playTone(ctx, 41.2, R + 3, 5, 0.09, 'sine', 30, 0.5, 0, 0.8);
    } else if (tier === 12) {
        // big bang
        const v = 5.6;
        RARITY_FX[12].hb.forEach((ms, i, a) => {
            const k = (i + 1) / a.length;
            const t = start + ms / 1000;
            playTone(ctx, 3520 - i * 330, t, 0.9 + k, 0.012 + k * 0.03, 'sine', null, 0.9, 0, 0.003);
            playTone(ctx, 55 * (1 + k), t, 0.6, 0.04 * k, 'sine', 40, 0.5, 0, 0.01);
        });
        riser(ctx, start + 2.6, v - 2.9, 0.07, 80, 5200);
        const R = start + v + 0.15;
        boom(ctx, R, 1, 5.5);
        boom(ctx, R + 0.03, 1, 4.6);
        boom(ctx, R + 0.4, 0.75, 3.8);
        boom(ctx, R + 1.1, 0.5, 3);
        playNoise(ctx, R, 4.4, 0.45, 15000, 120, 'highpass', 0.7, 0.7, 0.002);
        padChord(ctx, R, [32.7, 65.41, 98, 130.81, 196, 261.63, 293.66, 392, 523.25, 587.33, 783.99, 1046.5], 10, 0.012, 'sawtooth', 5600);
        padChord(ctx, R + 0.5, [1046.5, 1174.66, 1567.98, 2093, 2349.32, 3135.96], 9, 0.011, 'triangle', 8000);
        arp(ctx, R + 0.05, [261.63, 293.66, 392, 523.25, 587.33, 783.99, 1046.5, 1174.66, 1567.98, 2093, 2349.32, 3135.96, 4186], 0.05, 0.065);
        arp(ctx, R + 1.4, [392, 523.25, 587.33, 783.99, 1046.5, 1174.66, 1567.98, 2093, 2349.32, 3135.96, 4186, 4698.63], 0.075, 0.05, 'sine');
        sparkle(ctx, R + 0.2, 100, 8.5, 0.036, [1046.5, 1174.66, 1567.98, 2093, 2349.32, 3135.96, 4186, 4698.63]);
        [1567.98, 2093, 3135.96, 4186].forEach((f, i) => playTone(ctx, f, R + 2.4 + i * 0.5, 7, 0.03, 'sine', f * 1.006, 0.9, 0, 0.08));
        toll(ctx, R + 3.4, 261.63, 0.05, 6);
        playTone(ctx, 65.41, R + 4, 6, 0.08, 'sine', 49, 0.5, 0, 1);
    }
}
function playBuildup(tier, seconds) {
    if (tier < 6 || !$('audioEnabled').checked || soundTiers[tier] === false) {
        return;
    }
    const ctx = prepareAudio();
    if (!ctx) {
        return;
    }
    const t = ctx.currentTime;
    const d = Math.max(1.2, seconds);
    riser(ctx, t, d, 0.02 + (tier - 6) * 0.012, 100 + (tier - 6) * 18, 700 + (tier - 6) * 200);
    if (tier >= 8) {
        playTone(ctx, 55, t, d, 0.05, 'sine', 90, 0.3, 0, d * 0.6);
    }
}
function playResultChime(score, dark) {
    stopRollTicks();
    if (!$('audioEnabled').checked) {
        return;
    }
    const tier = getRarityTier(score);
    if (tier > 0 && soundTiers[tier] === false) {
        const ctx = prepareAudio();
        if (ctx) {
            const t = ctx.currentTime;
            tone(880, t, 0.42, 0.035, 'sine');
            tone(1174.66, t + 0.09, 0.58, 0.022, 'sine');
        }
        return;
    }
    const ctx = prepareAudio();
    if (!ctx) {
        return;
    }
    const t = ctx.currentTime;
    if (dark && tier >= 5) {
        darkSound(ctx, t, tier);
        return;
    }
    if (tier >= 6) {
        bigSound(ctx, t, tier);
        return;
    }
    const patterns = {
        0: [[783.99, 0, 0.42, 0.035, 'sine'], [1046.5, 0.1, 0.58, 0.023, 'sine']],
        1: [[880, 0, 0.48, 0.04, 'sine'], [1174.66, 0.09, 0.6, 0.028, 'sine'], [1567.98, 0.17, 0.68, 0.018, 'sine']],
        2: [
            [659.25, 0, 0.6, 0.045, 'triangle'], [987.77, 0.09, 0.68, 0.035, 'sine'], [1318.51, 0.18, 0.8, 0.028, 'sine'], [1760, 0.28, 0.9, 0.018, 'sine']
        ],
        3: [
            [523.25, 0, 0.8, 0.05, 'triangle'], [783.99, 0.08, 0.85, 0.04, 'sine'], [1046.5, 0.17, 0.95, 0.035, 'sine'], [1567.98, 0.27, 1.05, 0.026, 'sine'], [2093, 0.39, 1.1, 0.018, 'sine']
        ],
        4: [
            [392, 0, 1, 0.055, 'triangle'], [587.33, 0.08, 1.05, 0.045, 'sine'], [783.99, 0.16, 1.1, 0.04, 'sine'], [1174.66, 0.25, 1.2, 0.035, 'sine'], [1567.98, 0.35, 1.25, 0.03, 'sine'], [2349.32, 0.48, 1.35, 0.022, 'sine']
        ],
        5: [
            [261.63, 0, 1.2, 0.06, 'triangle'], [392, 0.08, 1.25, 0.05, 'sine'], [523.25, 0.16, 1.3, 0.045, 'sine'], [783.99, 0.25, 1.4, 0.04, 'sine'], [1046.5, 0.36, 1.5, 0.035, 'sine'], [1567.98, 0.48, 1.6, 0.03, 'sine'], [2093, 0.62, 1.7, 0.024, 'sine'], [2637.02, 0.78, 1.8, 0.016, 'sine']
        ]
    };
    (patterns[tier] || patterns[0]).forEach(([f, offset, dur, vol, type]) => tone(f, t + offset, dur, vol, type));
    if (tier >= 3) {
        tone(110, t, 0.45, 0.018, 'sine', 55);
    }
}
$('audioEnabled').addEventListener('change', () => {
    try {
        localStorage.setItem('elementalAudioEnabled', $('audioEnabled').checked ? 'true' : 'false');
    } catch (e) { }
    if (!$('audioEnabled').checked) {
        stopRollTicks();
    }
});
document.querySelectorAll('[data-sound-tier]').forEach(input => {
    input.checked = soundTiers[input.dataset.soundTier] !== false;
    input.addEventListener('change', () => {
        soundTiers[input.dataset.soundTier] = input.checked;
        try {
            localStorage.setItem('elementalSoundTiers', JSON.stringify(soundTiers));
        } catch (e) { }
    });
});
const RARITY_FX = [
    null,
    { c: '#7cc8ff', c2: '#2f6bff', ms: 1800 },
    { c: '#5eead4', c2: '#0e9f9a', ms: 2300 },
    { c: '#b39dff', c2: '#6d4cff', ms: 3000 },
    { c: '#f78fd8', c2: '#c026d3', ms: 3600 },
    { c: '#ffd166', c2: '#ff8c1a', ms: 4400 },
    { c: '#ff9a5c', c2: '#e8431a', ms: 5200 },
    { c: '#ff5d7a', c2: '#b0123a', ms: 6000 },
    { c: '#c9b8ff', c2: '#4b2bff', ms: 6200, vd: 2400, hb: [500, 1050, 1500, 1850, 2100] },
    { c: '#fff6d6', c2: '#ff7ad9', ms: 8000, vd: 4320, hb: [0, 900, 1700, 2400, 3000, 3500, 3900] },
    // 10-12 also have a gradient (g)
    { c: '#3ff0ff', c2: '#7a5cff', g: 'linear-gradient(100deg,#3ff0ff,#7a5cff)', ms: 8400, vd: 3600, hb: [0, 800, 1500, 2100, 2600, 3000, 3300] },
    { c: '#c45cff', c2: '#ff4fd8', g: 'linear-gradient(100deg,#3ff0ff,#c45cff,#ff4fd8)', ms: 9000, vd: 4600, hb: [0, 1100, 2000, 2800, 3400, 3900, 4250, 4450] },
    { c: '#ffd36e', c2: '#ff7ad9', g: 'linear-gradient(100deg,#ffd36e,#ff7ad9,#7a5cff,#3ff0ff)', ms: 10400, vd: 5600, hb: [1400, 2600, 3500, 4200, 4700, 5100, 5350] }
];
// secret variants, tiers 5-12
const SECRET_CHANCE = 0.1;
const RARITY_DARK = [
    null, null, null, null, null,
    { c: '#b3201c', c2: '#2a0404', ms: 4600 },
    { c: '#e0261c', c2: '#3a0000', ms: 5600 },
    { c: '#9dff3a', c2: '#0b2205', ms: 6400 },
    { c: '#ff2a2a', c2: '#160000', ms: 6200, vd: 2400, hb: [400, 1150, 1320, 1900, 2040, 2230] },
    { c: '#ff2a2a', c2: '#5a0000', ms: 8400, vd: 4320, hb: [0, 700, 1600, 1760, 2600, 3100, 3260, 3700, 3950, 4120] },
    { c: '#ff3b2a', c2: '#2a0008', ms: 8200, vd: 3600, hb: [0, 800, 1500, 2100, 2350, 3000, 3150, 3400] },
    { c: '#b0123a', c2: '#000000', ms: 9200, vd: 4600, hb: [0, 1100, 2000, 2150, 2800, 3400, 3550, 3900, 4250, 4400] },
    { c: '#d8d2c8', c2: '#3a0000', ms: 10600, vd: 5600, hb: [0, 900, 1900, 3000, 4200, 5300] }
];
let rarityEffectTimer = null;
let fxRunId = 0;
let runningFx = [];
let calmFx = false;
function tameFlash(frames, dur) {
    if (!frames.length || frames.some(f => f.opacity == null)) {
        return frames;
    }
    const n = frames.length;
    const off = frames.map((f, i) => f.offset != null ? f.offset : i === 0 ? 0 : i === n - 1 ? 1 : null);
    for (let i = 1; i < n; i++) {
        if (off[i] == null) {
            let j = i;
            while (off[j] == null) {
                j++;
            }
            for (let k = i; k < j; k++) {
                off[k] = off[i - 1] + (off[j] - off[i - 1]) * (k - i + 1) / (j - i + 1);
            }
        }
    }
    const ops = frames.map(f => +f.opacity);
    ops[0] = 0;
    let k = 1;
    for (let i = 0; i + 1 < n; i++) {
        const d = Math.abs(ops[i + 1] - ops[i]);
        if (d > 0) {
            k = Math.min(k, 0.0016 * Math.max(1, (off[i + 1] - off[i]) * dur) / d);
        }
    }
    const top = Math.max(...ops);
    if (top * k > 0.45) {
        k = 0.45 / top;
    }
    return frames.map((f, i) => Object.assign({}, f, { opacity: ops[i] * k }, f.easing && f.easing.includes('steps') ? { easing: 'linear' } : {}));
}
function animateFx(el, frames, o) {
    if (calmFx && el.classList.contains('fx-fill')) {
        frames = tameFlash(frames, (o && o.duration) || 1000);
        if (o && o.easing && o.easing.includes('steps')) {
            o = Object.assign({}, o, { easing: 'linear' });
        }
    }
    const a = el.animate(frames, Object.assign({ fill: 'both', easing: 'ease-out' }, o));
    runningFx.push(a);
    return a;
}
function createFxElement(ov, cls, css) {
    const e = document.createElement('div');
    e.className = 'fx ' + cls;
    if (css) {
        e.style.cssText = css;
    }
    ov.appendChild(e);
    return e;
}
function stopFx() {
    fxRunId++;
    if (rarityEffectTimer) {
        clearTimeout(rarityEffectTimer);
        rarityEffectTimer = null;
    }
    runningFx.splice(0).forEach(a => {
        try {
            a.cancel();
        } catch (e) { }
    });
    const ov = $('rarityEffect');
    if (ov) {
        ov.innerHTML = '';
    }
    document.body.classList.remove('fx-warping');
}
// Rarity effects
let runningPageFx = [];
function stopPageFx() {
    runningPageFx.splice(0).forEach(a => {
        try {
            a.cancel();
        } catch (e) { }
    });
    document.documentElement.classList.remove('fx-on');
    const app = document.querySelector('.app');
    if (app) {
        app.style.transformOrigin = '';
    }
}
function fxSprite(col, flat) {
    fxSprite.cache = fxSprite.cache || {};
    const key = col + (flat ? '_f' : '');
    if (fxSprite.cache[key]) {
        return fxSprite.cache[key];
    }
    const s = document.createElement('canvas');
    s.width = s.height = 48;
    const x = s.getContext('2d');
    // Normalise any colour (hex or hsl) to r,g,b so the glow fades out in its own colour.
    x.fillStyle = col;
    const h = parseInt(x.fillStyle.slice(1), 16);
    const rgb = (h >> 16) + ',' + (h >> 8 & 255) + ',' + (h & 255);
    const gr = x.createRadialGradient(24, 24, 0, 24, 24, 24);
    if (flat) {
        gr.addColorStop(0, 'rgba(' + rgb + ',1)');
        gr.addColorStop(0.3, 'rgba(' + rgb + ',.9)');
        gr.addColorStop(0.55, 'rgba(' + rgb + ',0)');
    } else {
        gr.addColorStop(0, 'rgba(255,255,255,1)');
        gr.addColorStop(0.12, 'rgba(255,255,255,.9)');
        gr.addColorStop(0.24, 'rgba(' + rgb + ',.9)');
        gr.addColorStop(0.5, 'rgba(' + rgb + ',.25)');
        gr.addColorStop(1, 'rgba(' + rgb + ',0)');
    }
    x.fillStyle = gr;
    x.fillRect(0, 0, 48, 48);
    return fxSprite.cache[key] = s;
}
// Particle field
function fxParticles(cv, o) {
    const dpr = Math.min(1.5, devicePixelRatio || 1);
    const W = innerWidth;
    const H = innerHeight;
    cv.width = W * dpr;
    cv.height = H * dpr;
    const g = cv.getContext('2d');
    g.scale(dpr, dpr);
    const { cx, cy, tok, plan, end } = o;
    const sc = Math.max(0.65, Math.min(1.4, Math.min(W, H) / 800));
    const diag = Math.hypot(W, H);
    const P = [];
    const MAX = 600;
    const pick = a => a[(Math.random() * a.length) | 0];
    const hue = () => 'hsl(' + ((Math.random() * 360) | 0) + ',100%,72%)';
    const colOf = e => e.cols === 'rainbow' ? hue() : pick(e.cols);
    const spawn = (e) => {
        if (P.length >= MAX) {
            return;
        }
        const col = colOf(e);
        const life = (e.life || 1.6) * (0.6 + Math.random() * 0.8);
        const size = (e.size || 2) * (0.5 + Math.random()) * sc;
        if (e.type === 'burst' || e.type === 'galaxy') {
            const a = Math.random() * 6.2832;
            const sp = (e.speed || 400) * (0.15 + Math.pow(Math.random(), 1.5) * 0.85) * sc;
            P.push({
                k: e.type, x: cx, y: cy, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, g: (e.grav || 0) * sc, drag: e.drag || 2.2, spin: e.type === 'galaxy' ? (e.spin || 1.4) : 0, age: 0, life, size, col, tw: Math.random() * 6.28, trail: e.trail
            });
        } else if (e.type === 'spiral') {
            P.push({
                k: 'spiral', a: Math.random() * 6.2832, r0: diag * (0.25 + Math.random() * 0.35), spin: (e.dir || 1) * (0.6 + Math.random() * 1.2), age: 0, life: life * 0.9, size, col, px: 0, py: 0
            });
        } else if (e.type === 'embers') {
            const x = e.wide ? Math.random() * W : cx + (Math.random() - 0.5) * W * 0.6;
            P.push({
                k: 'ember', x, y: H + 10, vx: 0, vy: -(60 + Math.random() * 120) * sc, sway: Math.random() * 6.28, age: 0, life: life * 1.6, size, col, tw: Math.random() * 6.28
            });
        } else if (e.type === 'rain') {
            P.push({
                k: 'rain', x: Math.random() * W, y: -20, vx: (Math.random() - 0.5) * 40, vy: (260 + Math.random() * 380) * sc, age: 0, life: life * 1.4, size: size * 0.8, col
            });
        } else if (e.type === 'ash') {
            P.push({
                k: 'ash', x: Math.random() * W, y: -10 - Math.random() * 40, vy: (35 + Math.random() * 70) * sc, sway: Math.random() * 6.28, age: 0, life: life * 2, size, col, dk: 1
            });
        } else if (e.type === 'stars') {
            const a = Math.random() * 6.2832;
            const r = diag * (0.08 + Math.random() * 0.55);
            P.push({
                k: 'star', a, r, pull: e.pull || 0, rot: (e.rot || 0.08) * (0.5 + Math.random()), age: 0, life: e.life || 5, size: size * 0.7, col, tw: Math.random() * 6.28
            });
        }
    };
    const t0 = performance.now();
    let last = t0;
    const st = plan.map(e => ({ e, fired: false, acc: 0 }));
    (function f(now) {
        if (tok !== fxRunId) {
            g.clearRect(0, 0, W, H);
            return;
        }
        const t = now - t0;
        const dt = Math.min(0.05, (now - last) / 1000);
        last = now;
        st.forEach(s => {
            const e = s.e;
            if (e.rate) {
                if (t >= e.at && t < e.until) {
                    const k = (t - e.at) / (e.until - e.at);
                    s.acc += e.rate * (e.ramp ? 0.2 + 0.8 * k : 1) * dt;
                    while (s.acc >= 1) {
                        s.acc--;
                        spawn(e);
                    }
                }
            } else if (!s.fired && t >= e.at) {
                s.fired = true;
                for (let i = 0; i < e.n; i++) {
                    spawn(e);
                }
            }
        });
        g.clearRect(0, 0, W, H);
        g.globalCompositeOperation = 'lighter';
        g.lineCap = 'round';
        for (let i = P.length; i--;) {
            const p = P[i];
            p.age += dt;
            const k = p.age / p.life;
            if (k >= 1) {
                P.splice(i, 1);
                continue;
            }
            let x;
            let y;
            let al;
            if (p.k === 'spiral') {
                const r = p.r0 * Math.pow(1 - k, 1.6);
                const a = p.a + p.spin * k * 2.4;
                x = cx + Math.cos(a) * r;
                y = cy + Math.sin(a) * r;
                al = Math.sin(Math.PI * k) * 0.9;
                if (p.px) {
                    g.globalAlpha = al * 0.55;
                    g.strokeStyle = p.col;
                    g.lineWidth = p.size * 0.7;
                    g.beginPath();
                    g.moveTo(p.px, p.py);
                    g.lineTo(x, y);
                    g.stroke();
                }
                p.px = x;
                p.py = y;
            } else if (p.k === 'star') {
                p.a += p.rot * dt;
                p.r = Math.max(0, p.r - p.pull * dt * (0.4 + k));
                x = cx + Math.cos(p.a) * p.r;
                y = cy + Math.sin(p.a) * p.r * 0.8;
                al = Math.min(1, k * 6) * Math.min(1, (1 - k) * 4) * (0.55 + 0.45 * Math.sin(p.tw + p.age * 5));
            } else if (p.k === 'ash') {
                p.sway += dt * 1.6;
                p.x += Math.sin(p.sway) * 30 * sc * dt;
                p.y += p.vy * dt;
                x = p.x;
                y = p.y;
                al = Math.min(1, k * 4) * Math.pow(1 - k, 0.6) * 0.85;
            } else if (p.k === 'ember') {
                p.sway += dt * 2;
                p.x += (Math.sin(p.sway) * 22 * sc) * dt;
                p.y += p.vy * dt;
                x = p.x;
                y = p.y;
                al = Math.min(1, k * 5) * Math.pow(1 - k, 0.8) * (0.7 + 0.3 * Math.sin(p.tw + p.age * 9));
            } else if (p.k === 'rain') {
                p.x += p.vx * dt;
                p.y += p.vy * dt;
                x = p.x;
                y = p.y;
                al = Math.pow(1 - k, 0.7);
                g.globalAlpha = al * 0.5;
                g.strokeStyle = p.col;
                g.lineWidth = p.size * 0.6;
                g.beginPath();
                g.moveTo(x, y - p.vy * 0.05);
                g.lineTo(x, y);
                g.stroke();
            } else {
                const dr = Math.exp(-p.drag * dt);
                if (p.spin) {
                    const rx = p.x - cx;
                    const ry = p.y - cy;
                    const d = Math.hypot(rx, ry) || 1;
                    p.vx += (-ry / d) * p.spin * 90 * sc * dt;
                    p.vy += (rx / d) * p.spin * 90 * sc * dt;
                }
                p.vx *= dr;
                p.vy = p.vy * dr + p.g * dt;
                p.x += p.vx * dt;
                p.y += p.vy * dt;
                x = p.x;
                y = p.y;
                al = Math.pow(1 - k, 1.3) * (0.8 + 0.2 * Math.sin(p.tw + p.age * 14));
                if (p.trail && Math.abs(p.vx) + Math.abs(p.vy) > 200) {
                    g.globalAlpha = al * 0.45;
                    g.strokeStyle = p.col;
                    g.lineWidth = p.size * 0.7;
                    g.beginPath();
                    g.moveTo(x - p.vx * 0.03, y - p.vy * 0.03);
                    g.lineTo(x, y);
                    g.stroke();
                }
            }
            g.globalAlpha = Math.max(0, al);
            g.globalCompositeOperation = p.dk ? 'source-over' : 'lighter';
            const d = p.size * 6;
            g.drawImage(fxSprite(p.col, p.dk), x - d / 2, y - d / 2, d, d);
        }
        g.globalCompositeOperation = 'source-over';
        g.globalAlpha = 1;
        if (t < end || P.length) {
            requestAnimationFrame(f);
        } else {
            g.clearRect(0, 0, W, H);
        }
    })(t0);
}
function triggerRarityEffect(rec, dark) {
    const tier = getRarityTier(rec.score);
    if (!tier || rarityEffects[tier] === false) {
        return;
    }
    playRarityFx(tier, dark && tier >= 5);
}
function playRarityFx(tier, dark) {
    const T = (dark ? RARITY_DARK : RARITY_FX)[tier];
    const ov = $('rarityEffect');
    const vd = T.vd || 0;
    const D = vd;
    const total = vd + T.ms;
    const W = innerWidth;
    const H = innerHeight;
    const c = T.c;
    const c2 = T.c2;
    stopFx();
    stopPageFx();
    const tok = fxRunId;
    const onGame = $('game').classList.contains('active');
    // Centre on the roll window(s).
    const reels = [...document.querySelectorAll('#rollResults .reel')].filter(r => r.getBoundingClientRect().width);
    let box = null;
    reels.forEach(r => {
        const b = r.getBoundingClientRect();
        box = box ? { left: Math.min(box.left, b.left), top: Math.min(box.top, b.top), right: Math.max(box.right, b.right), bottom: Math.max(box.bottom, b.bottom) } : { left: b.left, top: b.top, right: b.right, bottom: b.bottom };
    });
    const inView = onGame && box && box.bottom > 0 && box.top < H;
    const cx = inView ? (box.left + box.right) / 2 : W / 2;
    const cy = inView ? Math.min(Math.max((box.top + box.bottom) / 2, H * 0.15), H * 0.85) : H / 2;
    const at = 'left:' + cx + 'px;top:' + cy + 'px;';
    const TR = 'translate(-50%,-50%) ';
    const E = (cls, css) => createFxElement(ov, cls, css);
    const A = (el, fr, o) => animateFx(el, fr, o);
    ov.style.setProperty('--c', c);
    ov.style.setProperty('--c2', c2);
    const done = () => {
        rarityEffectTimer = setTimeout(() => {
            stopFx();
            stopPageFx();
        }, total + 500);
    };
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
        const e = E('fx-fill', 'box-shadow:inset 0 0 0 1px ' + c + ',inset 0 0 ' + (40 + tier * 14) + 'px ' + tier + 'px ' + c2);
        A(e, [{ opacity: 0 }, { opacity: 0.85, offset: 0.2 }, { opacity: 0 }], { duration: 1400 + tier * 200, easing: 'linear' });
        done();
        return;
    }
    // Page elements that can be moved.
    const q = s => document.querySelector(s);
    const app = q('.app');
    const game = $('game');
    const head = q('#game .page-head');
    const side = q('#game .roll-side');
    const controls = q('#game .roll-controls');
    const hint = $('autoHint');
    const cards = [...document.querySelectorAll('#rollResults .result-card')];
    const parts = [head, ...cards, controls, hint, side].filter(el => el && el.getBoundingClientRect().height);
    const P = (el, fr, o) => {
        if (!onGame || !el) {
            return null;
        }
        if (calmFx && fr.some(f => /invert|brightness\((?:[2-9]|1\.[5-9])/.test(f.filter || ''))) {
            return null;
        }
        const a = el.animate(fr, Object.assign({ fill: 'none', easing: 'ease-out' }, o));
        runningPageFx.push(a);
        return a;
    };
    if (onGame) {
        document.documentElement.classList.add('fx-on');
    }
    const origin = el => {
        const r = el.getBoundingClientRect();
        return (cx - r.left) + 'px ' + (cy - r.top) + 'px';
    };
    const vec = el => {
        const r = el.getBoundingClientRect();
        const dx = r.left + r.width / 2 - cx;
        const dy = r.top + r.height / 2 - cy;
        const d = Math.hypot(dx, dy) || 1;
        return { dx: dx / d, dy: dy / d, d };
    };
    // building blocks
    const ring = (delay, dur, to, col, w, glow, from) => {
        const r = E('fx-ring', at + 'width:12vmin;height:12vmin;border-width:' + (w || 1.5) + 'px;border-color:' + col + ';box-shadow:0 0 ' + (glow || 14) + 'px ' + col + ',inset 0 0 ' + (glow || 14) + 'px ' + col);
        A(r, [{ opacity: 0, transform: TR + 'scale(' + (from || 0.3) + ')' }, { opacity: 1, offset: 0.08 }, { opacity: 0, transform: TR + 'scale(' + to + ')' }], { duration: dur, delay, easing: 'cubic-bezier(.15,.75,.25,1)' });
    };
    const ringIn = (delay, dur, from, col) => {
        const r = E('fx-ring', at + 'width:12vmin;height:12vmin;border-width:1px;border-color:' + col + ';box-shadow:0 0 12px ' + col);
        A(r, [{ opacity: 0, transform: TR + 'scale(' + from + ')' }, { opacity: 0.7, offset: 0.4 }, { opacity: 0, transform: TR + 'scale(.6)' }], { duration: dur, delay, easing: 'cubic-bezier(.5,0,.9,.5)' });
    };
    const bloom = (delay, dur, size, col, peak) => {
        const b = E('fx-bloom', at + 'width:' + size + 'vmin;height:' + size + 'vmin;margin:-' + size / 2 + 'vmin 0 0 -' + size / 2 + 'vmin;mix-blend-mode:screen;background:radial-gradient(circle,#fff 0,' + col + ' 18%,transparent 62%)');
        A(b, [{ opacity: 0, transform: 'scale(.3)' }, { opacity: peak, transform: 'scale(1)', offset: 0.16 }, { opacity: 0, transform: 'scale(1.35)' }], { duration: dur, delay });
    };
    const flash = (delay, dur, col, peak, spread) => {
        const f = E('fx-fill', 'mix-blend-mode:screen;background:radial-gradient(circle at ' + cx + 'px ' + cy + 'px,' + col + ' 0,transparent ' + (spread || 70) + '%)');
        A(f, [{ opacity: 0 }, { opacity: peak, offset: 0.08 }, { opacity: 0 }], { duration: dur, delay, easing: 'ease-out' });
    };
    const veil = (delay, dur, peak, hold, rgb, inner) => {
        const v = E('fx-fill', 'background:radial-gradient(circle at ' + cx + 'px ' + cy + 'px,rgba(' + rgb + ',0) ' + (inner || 12) + '%,rgba(' + rgb + ',.85) 70%,rgba(' + rgb + ',1) 100%)');
        A(v, [{ opacity: 0 }, { opacity: peak, offset: hold[0] }, { opacity: peak, offset: hold[1] }, { opacity: 0 }], { duration: dur, delay, easing: 'ease-in-out' });
        return v;
    };
    const edge = (delay, dur, col, k) => {
        const e = E('fx-fill', 'box-shadow:inset 0 0 0 1px ' + col + ',inset 0 0 ' + (50 * k) + 'px ' + (4 * k) + 'px ' + col);
        A(e, [{ opacity: 0 }, { opacity: 0.9, offset: 0.12 }, { opacity: 0 }], { duration: dur, delay, easing: 'ease-in-out' });
        return e;
    };
    const rays = (delay, dur, peak, turn, cols, count, size) => {
        const rw = E('fx-raysw', at + (size ? 'width:' + size + 'vmax;height:' + size + 'vmax;margin:-' + size / 2 + 'vmax 0 0 -' + size / 2 + 'vmax;' : ''));
        const ri = document.createElement('i');
        ri.style.background = 'conic-gradient(' + cols.concat(cols[0]).join(',') + ')';
        const step = 360 / (count || 36);
        const m = 'repeating-conic-gradient(#000 0 ' + (step * 0.16).toFixed(2) + 'deg,transparent ' + (step * 0.5).toFixed(2) + 'deg ' + step.toFixed(2) + 'deg)';
        ri.style.webkitMaskImage = m;
        ri.style.maskImage = m;
        rw.appendChild(ri);
        A(rw, [{ opacity: 0, transform: 'rotate(0deg) scale(.6)' }, { opacity: peak, offset: 0.22 }, { opacity: peak * 0.7, offset: 0.6 }, { opacity: 0, transform: 'rotate(' + turn + 'deg) scale(1.05)' }], { duration: dur, delay, easing: 'cubic-bezier(.2,.6,.3,1)' });
        return rw;
    };
    const bars = (delay, dur, h) => {
        const hide = ['translateY(-101%)', 'translateY(101%)'];
        ['top', 'bot'].forEach((p, i) => {
            const b = E('fx-bar ' + p, 'height:' + h + 'vh');
            A(b, [{ transform: hide[i] }, { transform: 'none', offset: 0.12 }, { transform: 'none', offset: 0.86 }, { transform: hide[i] }], { duration: dur, delay, easing: 'cubic-bezier(.6,0,.2,1)' });
        });
    };
    const aurora = (delay, dur, cols, peak) => {
        cols.forEach((col, i) => {
            const y = 8 + i * 14;
            const a = E('fx-aurora', 'top:' + y + 'vh;background:radial-gradient(50% 50% at 50% 50%,' + col + ',transparent 70%)');
            const dir = i % 2 ? -1 : 1;
            A(a, [
                { opacity: 0, transform: 'translateX(' + (-12 * dir) + 'vw) scaleY(.6) skewX(' + (-14 * dir) + 'deg)' },
                { opacity: peak, offset: 0.3 },
                { opacity: peak * 0.8, offset: 0.7 },
                { opacity: 0, transform: 'translateX(' + (12 * dir) + 'vw) scaleY(1.2) skewX(' + (14 * dir) + 'deg)' }
            ], { duration: dur, delay: delay + i * 160, easing: 'ease-in-out' });
        });
    };
    // A light sweep across each roll window, and light running round its edge.
    const reelFx = (fn) => reels.forEach(r => {
        const b = r.getBoundingClientRect();
        if (!b.width || b.bottom < 0 || b.top > H) {
            return;
        }
        fn(b);
    });
    const sweep = (delay, dur, col) => reelFx(b => {
        const w = E('fx-clip', 'left:' + b.left + 'px;top:' + b.top + 'px;width:' + b.width + 'px;height:' + b.height + 'px');
        const s = document.createElement('i');
        s.style.background = 'linear-gradient(105deg,transparent 30%,' + col + ' 46%,rgba(255,255,255,.95) 50%,' + col + ' 54%,transparent 70%)';
        w.appendChild(s);
        A(s, [{ transform: 'translateX(-100%)' }, { transform: 'translateX(100%)' }], { duration: dur, delay, easing: 'cubic-bezier(.45,0,.25,1)' });
        A(w, [{ opacity: 0 }, { opacity: 0.85, offset: 0.15 }, { opacity: 0.85, offset: 0.8 }, { opacity: 0 }], { duration: dur, delay, easing: 'linear' });
    });
    const trace = (delay, dur, col, laps, wid) => reelFx(b => {
        const w = E('fx-trace', 'left:' + (b.left - 3) + 'px;top:' + (b.top - 3) + 'px;width:' + (b.width + 6) + 'px;height:' + (b.height + 6) + 'px;padding:' + (wid || 3) + 'px;filter:drop-shadow(0 0 6px ' + col + ')');
        const s = document.createElement('i');
        const sz = Math.hypot(b.width, b.height) * 1.1;
        s.style.width = s.style.height = sz + 'px';
        s.style.background = 'conic-gradient(transparent 0 62%,' + col + ' 82%,#fff 92%,transparent 93%)';
        w.appendChild(s);
        A(s, [{ transform: 'translate(-50%,-50%) rotate(0deg)' }, { transform: 'translate(-50%,-50%) rotate(' + 360 * (laps || 1) + 'deg)' }], { duration: dur, delay, easing: 'cubic-bezier(.4,.1,.3,1)' });
        A(w, [{ opacity: 0 }, { opacity: 1, offset: 0.1 }, { opacity: 1, offset: 0.75 }, { opacity: 0 }], { duration: dur, delay, easing: 'linear' });
    });
    const reelGlow = (delay, dur, col, scale) => {
        reelFx(b => {
            const g = E('fx-fill', 'inset:auto;left:' + b.left + 'px;top:' + b.top + 'px;width:' + b.width + 'px;height:' + b.height + 'px;box-shadow:0 0 0 2px ' + col + ',0 0 50px 6px ' + col);
            A(g, [{ opacity: 0, transform: 'none' }, { opacity: 1, transform: 'scale(' + scale + ')', offset: 0.2 }, { opacity: 0, transform: 'none' }], { duration: dur, delay, easing: 'cubic-bezier(.2,.8,.2,1)' });
        });
        reels.forEach(r => P(r, [{ transform: 'none' }, { transform: 'scale(' + scale + ')', offset: 0.2 }, { transform: 'none' }], { duration: dur, delay, easing: 'cubic-bezier(.2,.8,.2,1)' }));
    };
    const shake = (el, delay, dur, amp, rot) => {
        const fr = [];
        const n = Math.max(8, Math.round(dur / 45));
        for (let i = 0; i <= n; i++) {
            const k = Math.pow(1 - i / n, 1.6);
            fr.push({ transform: i === 0 || i === n ? 'none' : 'translate(' + ((Math.random() - 0.5) * 2 * amp * k).toFixed(1) + 'px,' + ((Math.random() - 0.5) * 2 * amp * k).toFixed(1) + 'px) rotate(' + ((Math.random() - 0.5) * 2 * (rot || 0) * k).toFixed(2) + 'deg)' });
        }
        P(el, fr, { duration: dur, delay, easing: 'linear' });
    };
    const rumble = (el, delay, dur, amp) => {
        const fr = [];
        const n = Math.max(8, Math.round(dur / 40));
        for (let i = 0; i <= n; i++) {
            const k = Math.pow(i / n, 2);
            fr.push({ transform: i === 0 || i === n ? 'none' : 'translate(' + ((Math.random() - 0.5) * 2 * amp * k).toFixed(1) + 'px,' + ((Math.random() - 0.5) * 2 * amp * k).toFixed(1) + 'px)' });
        }
        P(el, fr, { duration: dur, delay, easing: 'linear' });
    };
    // Page parts pushed away from the roll window by a wave, springing back.
    const shockPage = (delay, dist, rot, speed) => parts.forEach(el => {
        const v = vec(el);
        const lag = v.d / (speed || 1.6);
        const r = (Math.random() - 0.5) * 2 * (rot || 0);
        P(el, [
            { transform: 'none' },
            { transform: 'translate(' + (v.dx * dist).toFixed(1) + 'px,' + (v.dy * dist).toFixed(1) + 'px) rotate(' + r.toFixed(2) + 'deg)', offset: 0.18 },
            { transform: 'translate(' + (-v.dx * dist * 0.18).toFixed(1) + 'px,' + (-v.dy * dist * 0.18).toFixed(1) + 'px) rotate(' + (-r * 0.2).toFixed(2) + 'deg)', offset: 0.5 },
            { transform: 'translate(' + (v.dx * dist * 0.05).toFixed(1) + 'px,' + (v.dy * dist * 0.05).toFixed(1) + 'px)', offset: 0.75 },
            { transform: 'none' }
        ], { duration: 900 + dist * 4, delay: delay + lag, easing: 'cubic-bezier(.2,.7,.3,1)' });
    });
    const dof = (delay, dur, blur, fade) => parts.forEach(el => P(el, [
        { filter: 'none', opacity: 1 },
        { filter: 'blur(' + blur + 'px) saturate(.4)', opacity: fade, offset: 0.2 },
        { filter: 'blur(' + blur + 'px) saturate(.4)', opacity: fade, offset: 0.7 },
        { filter: 'none', opacity: 1 }
    ], { duration: dur, delay, easing: 'ease-in-out' }));
    const cv = document.createElement('canvas');
    cv.className = 'fx fx-canvas';
    const particles = (plan, end) => {
        ov.appendChild(cv);
        fxParticles(cv, { cx, cy, tok, plan, end: end || total });
    };
    // retro/astral skins (secrets stay normal)
    const skin = !dark && effectSkin();
    if (skin && FX_SKINS[skin]) {
        FX_SKINS[skin](tier, { T, vd, total, cx, cy, tok, ov, E, A, P, app, game, parts, reels, shake, rumble, shockPage, dof, veil, bars, edge, reelGlow, flash, sweep, trace, ring, bloom, rays, aurora, particles });
        done();
        return;
    }
    // secret (dark) variants for tiers 5 to 9
    if (dark) {
        // jagged crack lines spreading out from a point, drawn on over dur
        const cracks = (delay, dur, n, reach, col, w, ox, oy, keep) => {
            const sx = ox == null ? cx : ox;
            const sy = oy == null ? cy : oy;
            const ns = 'http://www.w3.org/2000/svg';
            const svg = document.createElementNS(ns, 'svg');
            svg.setAttribute('class', 'fx fx-cracks');
            svg.setAttribute('width', W);
            svg.setAttribute('height', H);
            svg.setAttribute('viewBox', '0 0 ' + W + ' ' + H);
            ov.appendChild(svg);
            const lines = [];
            const walk = (x, y, a, len, depth) => {
                const pts = [[x, y]];
                let L = 0;
                while (L < len) {
                    const step = 14 + Math.random() * 30;
                    a += (Math.random() - 0.5) * 0.7;
                    x += Math.cos(a) * step;
                    y += Math.sin(a) * step;
                    L += step;
                    pts.push([x, y]);
                    if (depth < 2 && Math.random() < 0.12) {
                        walk(x, y, a + (Math.random() < 0.5 ? -1 : 1) * (0.5 + Math.random() * 0.6), len * (0.25 + Math.random() * 0.3), depth + 1);
                    }
                }
                lines.push({ pts, L, depth });
            };
            for (let i = 0; i < n; i++) {
                walk(sx, sy, (i / n) * 6.2832 + Math.random() * 0.5, reach * (0.55 + Math.random() * 0.6), 0);
            }
            lines.forEach(l => {
                const d = 'M' + l.pts.map(p => p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join('L');
                [['rgba(0,0,0,.85)', w + 2.5], [col, w * (l.depth ? 0.6 : 1)]].forEach(([st, sw]) => {
                    const path = document.createElementNS(ns, 'path');
                    path.setAttribute('d', d);
                    path.setAttribute('fill', 'none');
                    path.setAttribute('stroke', st);
                    path.setAttribute('stroke-width', sw);
                    path.setAttribute('stroke-linejoin', 'bevel');
                    path.setAttribute('stroke-dasharray', l.L + 40);
                    path.setAttribute('stroke-dashoffset', l.L + 40);
                    svg.appendChild(path);
                    A(path, [{ strokeDashoffset: l.L + 40 }, { strokeDashoffset: 0 }], { duration: dur * (0.5 + l.depth * 0.25), delay: delay + l.depth * dur * 0.3, easing: 'cubic-bezier(.1,.9,.3,1)' });
                });
            });
            A(svg, [{ opacity: 1 }, { opacity: 1, offset: 0.8 }, { opacity: 0 }], { duration: keep, delay, easing: 'linear' });
            return svg;
        };
        // dark glass shards thrown out from the roll window, tumbling and falling
        const shards = (delay, n, speed, tint) => {
            for (let i = 0; i < n; i++) {
                const s = 8 + Math.random() * 34;
                const pts = [];
                const k = 3 + (Math.random() * 2 | 0);
                for (let j = 0; j < k; j++) {
                    const a = j / k * 6.2832 + Math.random() * 0.8;
                    pts.push((50 + Math.cos(a) * (30 + Math.random() * 20)).toFixed(0) + '% ' + (50 + Math.sin(a) * (30 + Math.random() * 20)).toFixed(0) + '%');
                }
                const el = E('fx-shard', at + 'width:' + s + 'px;height:' + s + 'px;margin:' + (-s / 2) + 'px 0 0 ' + (-s / 2) + 'px;clip-path:polygon(' + pts.join(',') + ');background:linear-gradient(' + (Math.random() * 360 | 0) + 'deg,rgba(255,255,255,.75),' + tint + ' 45%,rgba(0,0,0,.95))');
                const a = Math.random() * 6.2832;
                const v = speed * (0.35 + Math.random() * 0.65);
                const dx = Math.cos(a) * v;
                const dy = Math.sin(a) * v;
                const r = (Math.random() - 0.5) * 900;
                const fr = [];
                for (let j = 0; j <= 6; j++) {
                    const t = j / 6;
                    fr.push({ transform: 'translate(' + (dx * (1 - Math.pow(1 - t, 2))).toFixed(0) + 'px,' + (dy * (1 - Math.pow(1 - t, 2)) + 520 * t * t).toFixed(0) + 'px) rotate3d(1,.6,.3,' + (r * t).toFixed(0) + 'deg)', opacity: j === 6 ? 0 : 1 });
                }
                A(el, fr, { duration: 1300 + Math.random() * 900, delay: delay + Math.random() * 60, easing: 'linear' });
            }
        };
        // the whole screen breaks into black glass, holds, then falls away
        const screenShatter = (delay, hold) => {
            const cols = W > H ? 9 : 5;
            const rows = Math.round(cols * H / W) + 1;
            const gx = W / cols;
            const gy = H / rows;
            const P0 = [];
            for (let y = 0; y <= rows; y++) {
                P0.push([]);
                for (let x = 0; x <= cols; x++) {
                    const edgeX = x === 0 || x === cols;
                    const edgeY = y === 0 || y === rows;
                    P0[y].push([x * gx + (edgeX ? 0 : (Math.random() - 0.5) * gx * 0.7), y * gy + (edgeY ? 0 : (Math.random() - 0.5) * gy * 0.7)]);
                }
            }
            const tri = [];
            for (let y = 0; y < rows; y++) {
                for (let x = 0; x < cols; x++) {
                    const a = P0[y][x];
                    const b = P0[y][x + 1];
                    const c3 = P0[y + 1][x + 1];
                    const d = P0[y + 1][x];
                    if (Math.random() < 0.5) {
                        tri.push([a, b, c3], [a, c3, d]);
                    } else {
                        tri.push([a, b, d], [b, c3, d]);
                    }
                }
            }
            tri.forEach(t => {
                const minX = Math.min(t[0][0], t[1][0], t[2][0]);
                const minY = Math.min(t[0][1], t[1][1], t[2][1]);
                const maxX = Math.max(t[0][0], t[1][0], t[2][0]);
                const maxY = Math.max(t[0][1], t[1][1], t[2][1]);
                const w = maxX - minX + 1;
                const h = maxY - minY + 1;
                const poly = t.map(p => ((p[0] - minX) / w * 100).toFixed(1) + '% ' + ((p[1] - minY) / h * 100).toFixed(1) + '%').join(',');
                const mx = (minX + maxX) / 2;
                const my = (minY + maxY) / 2;
                const g = Math.random() * 360 | 0;
                const el = E('fx-shard', 'left:' + minX + 'px;top:' + minY + 'px;width:' + w + 'px;height:' + h + 'px;clip-path:polygon(' + poly + ');background:linear-gradient(' + g + 'deg,#16090b 0,#050203 55%,#2a1316 100%)');
                const dist = Math.hypot(mx - cx, my - cy);
                const away = { x: (mx - cx) / (dist || 1), y: (my - cy) / (dist || 1) };
                const start = hold + dist * 0.6 + Math.random() * 120;
                const L = start + 1400;
                const o = ms => ms / L;
                const r = (Math.random() - 0.5) * 140;
                A(el, [
                    { transform: 'none', opacity: 0, offset: 0 },
                    { transform: 'none', opacity: 1, offset: o(30) },
                    { transform: 'scale(.985)', opacity: 1, offset: o(start), easing: 'cubic-bezier(.5,0,.9,.5)' },
                    { transform: 'translate(' + (away.x * 120).toFixed(0) + 'px,' + (H * 0.9 + away.y * 80).toFixed(0) + 'px) rotate3d(' + (Math.random() - 0.5).toFixed(2) + ',1,.4,' + r.toFixed(0) + 'deg) scale(.8)', opacity: 0, offset: 1 }
                ], { duration: L, delay, easing: 'linear' });
            });
            // crack lines along the shard edges
            cracks(delay, 220, 16, Math.hypot(W, H), 'rgba(255,255,255,.9)', 1.2, null, null, hold + 900);
        };
        // failing-light flicker
        const flicker = (delay, dur, peak, rgb) => {
            const f = E('fx-fill', 'background:rgb(' + (rgb || '0,0,0') + ')');
            const fr = [];
            const n = 14;
            for (let i = 0; i <= n; i++) {
                fr.push({ opacity: i === 0 || i === n ? 0 : (Math.random() < 0.5 ? peak : peak * Math.random() * 0.3), easing: 'steps(1,end)' });
            }
            A(f, fr, { duration: dur, delay });
        };
        // scanlines and moving static
        const staticNoise = (delay, dur, peak) => {
            const c0 = document.createElement('canvas');
            c0.width = c0.height = 160;
            const x = c0.getContext('2d');
            const id = x.createImageData(160, 160);
            for (let i = 0; i < id.data.length; i += 4) {
                const v = Math.random() * 255;
                id.data[i] = id.data[i + 1] = id.data[i + 2] = v;
                id.data[i + 3] = 255;
            }
            x.putImageData(id, 0, 0);
            const n = E('fx-noise', 'background-image:repeating-linear-gradient(0deg,rgba(0,0,0,.55) 0 1px,transparent 1px 3px),url(' + c0.toDataURL() + ')');
            const fr = [];
            for (let i = 0; i <= 12; i++) {
                fr.push({ transform: 'translate(' + (-(Math.random() * 160) | 0) + 'px,' + (-(Math.random() * 160) | 0) + 'px)', easing: 'steps(1,end)' });
            }
            A(n, fr, { duration: 600, iterations: Math.ceil(dur / 600), delay });
            A(n, [{ opacity: 0 }, { opacity: peak, offset: 0.08 }, { opacity: peak * 0.6, offset: 0.7 }, { opacity: 0 }], { duration: dur, delay, easing: 'linear', composite: 'replace' });
        };
        // the page tears sideways in slices
        const tear = (el, delay, dur) => {
            const fr = [];
            const n = Math.round(dur / 70);
            for (let i = 0; i <= n; i++) {
                if (i === 0 || i === n) {
                    fr.push({ transform: 'none', clipPath: 'inset(0 0 0 0)', easing: 'steps(1,end)' });
                    continue;
                }
                const t = Math.random() * 80;
                const b = Math.random() * (100 - t) * 0.7;
                fr.push({ transform: 'translateX(' + ((Math.random() - 0.5) * 60).toFixed(0) + 'px)', clipPath: Math.random() < 0.6 ? 'inset(' + t.toFixed(0) + '% 0 ' + b.toFixed(0) + '% 0)' : 'inset(0 0 0 0)', easing: 'steps(1,end)' });
            }
            P(el, fr, { duration: dur, delay });
        };
        const blackout = (delay, dur, peak) => {
            const b = E('fx-fill', 'background:#000;opacity:0');
            A(b, [{ opacity: peak }, { opacity: peak, offset: 0.6 }, { opacity: 0 }], { duration: dur, delay, easing: 'ease-in', fill: 'none' });
        };
        // a black sun with a burning rim
        const eclipse = (delay, dur, size, col, col2) => {
            const e = E('fx-eclipse', at + 'width:' + size + 'vmin;height:' + size + 'vmin;margin:-' + size / 2 + 'vmin 0 0 -' + size / 2 + 'vmin;box-shadow:0 0 0 2px ' + col + ',0 0 30px 6px ' + col + ',0 0 120px 40px ' + col2 + ',inset 0 0 40px 6px ' + col2);
            A(e, [{ opacity: 0, transform: 'scale(.1)' }, { opacity: 1, transform: 'scale(1)', offset: 0.18 }, { opacity: 1, transform: 'scale(1.06)', offset: 0.7 }, { opacity: 0, transform: 'scale(1.6)' }], { duration: dur, delay, easing: 'cubic-bezier(.2,.8,.2,1)' });
        };
        // rays that pull inward and turn backwards
        const raysIn = (delay, dur, peak, turn, cols, count) => {
            const rw = E('fx-raysw', at);
            const ri = document.createElement('i');
            ri.style.background = 'conic-gradient(' + cols.concat(cols[0]).join(',') + ')';
            const step = 360 / (count || 36);
            const m = 'repeating-conic-gradient(#000 0 ' + (step * 0.16).toFixed(2) + 'deg,transparent ' + (step * 0.5).toFixed(2) + 'deg ' + step.toFixed(2) + 'deg)';
            ri.style.webkitMaskImage = m;
            ri.style.maskImage = m;
            rw.appendChild(ri);
            A(rw, [
                { opacity: 0, transform: 'rotate(0deg) scale(1.3)' },
                { opacity: peak, transform: 'rotate(' + turn * 0.2 + 'deg) scale(1.1)', offset: 0.2 },
                { opacity: peak * 0.7, transform: 'rotate(' + turn * 0.6 + 'deg) scale(.75)', offset: 0.6 },
                { opacity: 0, transform: 'rotate(' + turn + 'deg) scale(.45)' }
            ], { duration: dur, delay, easing: 'cubic-bezier(.5,0,.8,.6)' });
            return rw;
        };
        // page parts knocked crooked, hanging, then snapping back
        const slip = (delay, hold, amt) => parts.forEach((el, i) => {
            const r = (Math.random() - 0.5) * 2 * amt * 0.12;
            const y = amt * (0.4 + Math.random() * 0.8);
            const L = hold + 700;
            P(el, [
                { transform: 'none' },
                { transform: 'translateY(' + y.toFixed(0) + 'px) rotate(' + r.toFixed(2) + 'deg)', offset: 0.04, easing: 'ease-in-out' },
                { transform: 'translateY(' + (y * 1.08).toFixed(0) + 'px) rotate(' + (r * 1.1).toFixed(2) + 'deg)', offset: hold / L * 0.9 },
                { transform: 'translateY(' + (y * 1.1).toFixed(0) + 'px) rotate(' + (r * 1.1).toFixed(2) + 'deg)', offset: hold / L, easing: 'cubic-bezier(.3,1.4,.4,1)' },
                { transform: 'none' }
            ], { duration: L, delay: delay + i * 30, easing: 'linear' });
        });
        const reelCrack = (delay, n, col) => reelFx(b => cracks(delay, 260, n, Math.min(b.width, b.height) * 0.55, col, 1.4, b.left + b.width / 2, b.top + b.height / 2, total - delay));
        const ash = { type: 'ash', cols: ['#1a1a1a', '#2b2b2b', '#3d3535'], dark: 1 };
        if (tier === 5) {
            veil(0, 4400, 0.8, [0.08, 0.8], '12,2,2', 14);
            flicker(0, 1100, 0.7);
            P(app, [{ filter: 'none' }, { filter: 'grayscale(1) brightness(.8) contrast(1.1)', offset: 0.1 }, { filter: 'grayscale(1) brightness(.8) contrast(1.1)', offset: 0.85 }, { filter: 'none' }], { duration: 4200, easing: 'ease-in-out' });
            P(game, [
                { transform: 'none' },
                { transform: 'translateY(14px) rotate(1.4deg)', offset: 0.08, easing: 'cubic-bezier(.3,1.6,.5,1)' },
                { transform: 'translateY(16px) rotate(1.6deg)', offset: 0.85, easing: 'cubic-bezier(.6,0,.4,1)' },
                { transform: 'none' }
            ], { duration: 4200 });
            reelCrack(60, 7, 'rgba(255,255,255,.9)');
            shards(60, 14, 260, 'rgba(60,10,10,.9)');
            raysIn(200, 3800, 0.3, -40, [c, c2, '#000', c2], 24);
            edge(0, 4000, c, 1.6);
            particles([
                Object.assign({ at: 300, until: 4000, rate: 30, life: 3, size: 2.6 }, ash),
                { type: 'burst', at: 60, n: 40, cols: [c, '#5a0d0d'], speed: 300, life: 1.6, size: 1.8, grav: 160 }
            ]);
        }
        if (tier === 6) {
            blackout(0, 260, 1);
            veil(0, 5200, 0.85, [0.05, 0.75], '18,0,0', 12);
            cracks(150, 420, 11, Math.hypot(W, H) * 0.75, 'rgba(255,90,70,.95)', 1.6, null, null, 4600);
            flash(150, 1800, c, 0.5, 60);
            shake(game, 150, 1300, 20, 0.8);
            slip(250, 3200, 26);
            shards(150, 40, 520, 'rgba(90,10,10,.9)');
            raysIn(150, 4800, 0.4, -70, [c, c2, '#000', c, c2], 30);
            ring(150, 1600, 18, c, 2.5, 20);
            edge(150, 4800, c, 2.4);
            particles([
                Object.assign({ at: 400, until: 5000, rate: 45, life: 3.2, size: 2.8, wide: 1 }, ash),
                { type: 'burst', at: 150, n: 110, cols: [c, '#ff9a7a', '#4a0000'], speed: 700, life: 1.8, size: 2, grav: 260, trail: 1 }
            ]);
        }
        if (tier === 7) {
            // first hit
            shake(game, 0, 320, 10, 0.4);
            reelCrack(0, 6, 'rgba(255,255,255,.9)');
            blackout(0, 200, 0.8);
            // second hit: everything inverts and tears
            P(app, [
                { filter: 'none' },
                { filter: 'invert(1) contrast(1.4)', offset: 0.01 },
                { filter: 'invert(1) contrast(1.4) hue-rotate(60deg)', offset: 0.6 },
                { filter: 'none', offset: 0.62 },
                { filter: 'invert(1) contrast(1.4)', offset: 0.66 },
                { filter: 'none', offset: 0.7 },
                { filter: 'none' }
            ], { duration: 2200, delay: 340, easing: 'steps(1,end)' });
            tear(game, 340, 1500);
            staticNoise(340, 2600, 0.28);
            veil(340, 5800, 0.85, [0.04, 0.78], '0,8,0', 12);
            cracks(340, 380, 12, Math.hypot(W, H) * 0.8, c, 1.3, null, null, 5000);
            shards(340, 46, 620, 'rgba(20,50,10,.9)');
            raysIn(340, 5400, 0.4, -90, [c, c2, '#000', c2], 22);
            for (let i = 0; i < 5; i++) {
                ringIn(500 + i * 380, 1300, 16 - i, i % 2 ? c : '#fff');
            }
            shake(game, 1900, 1400, 14, 0.6);
            edge(340, 5400, c, 2.6);
            particles([
                Object.assign({ at: 700, until: 5600, rate: 40, life: 3, size: 2.6, wide: 1 }, ash),
                { type: 'spiral', at: 900, until: 4800, rate: 60, cols: [c, '#eaffd0'], life: 1.3, size: 1.8, dir: -1 },
                { type: 'burst', at: 340, n: 90, cols: [c, '#fff'], speed: 720, life: 1.4, size: 1.8, trail: 1, grav: 200 }
            ]);
        }
        if (tier === 8) {
            // build-up: darkness closes in, the heartbeat stumbles, the window cracks
            [42, 28, 18, 10].forEach((r, i) => veil(i * vd * 0.22, vd + 900 - i * vd * 0.22, 0.95, [0.6, 0.85], '0,0,0', r));
            if (app) {
                app.style.transformOrigin = origin(app);
            }
            P(app, [{ transform: 'none' }, { transform: 'scale(.9) rotate(1.6deg)', offset: 0.98 }, { transform: 'none' }], { duration: vd + 400, easing: 'cubic-bezier(.5,0,.9,.5)' });
            rumble(game, 0, vd, 5);
            (T.hb || []).forEach((ms, i, a) => {
                const k = (i + 1) / a.length;
                flash(ms, 400, c, 0.12 + k * 0.2, 25);
                reelCrack(ms, 2 + i, 'rgba(255,255,255,.85)');
                shake(game, ms, 160, 4 + k * 6, 0);
            });
            // release: black, then everything breaks outward and the light is pulled in
            blackout(vd, 380, 1);
            eclipse(vd + 200, 5400, 60, c, c2);
            cracks(vd + 200, 380, 14, Math.hypot(W, H) * 0.85, 'rgba(255,255,255,.9)', 1.6, null, null, 5200);
            shards(vd + 200, 60, 760, 'rgba(70,0,0,.9)');
            raysIn(vd + 200, 5600, 0.45, -110, [c, c2, '#000', c2], 30);
            shake(game, vd + 200, 1700, 22, 1);
            slip(vd + 300, 3400, 30);
            edge(vd + 200, 5600, c, 3);
            particles([
                { type: 'spiral', at: vd + 400, until: vd + 5000, rate: 110, cols: [c, '#ff8a6a', '#fff'], life: 1.6, size: 2.2, dir: -1 },
                { type: 'burst', at: vd + 200, n: 140, cols: [c, '#400000', '#fff'], speed: 900, life: 1.8, size: 2.2, grav: 220, trail: 1 },
                Object.assign({ at: vd + 600, until: vd + 5600, rate: 40, life: 3.4, size: 2.8, wide: 1 }, ash)
            ]);
        }
        if (tier === 9) {
            // build-up: the page drifts apart into a red void; the window cracks with every beat
            const v = E('fx-fill', 'background:radial-gradient(circle at ' + cx + 'px ' + cy + 'px,rgba(40,0,0,.45) 0,rgba(8,0,0,.97) 30%,#000 100%)');
            A(v, [{ opacity: 0 }, { opacity: 0.6, offset: 0.25 }, { opacity: 1, offset: vd / (vd + 900) }, { opacity: 1, offset: 0.98 }, { opacity: 0 }], { duration: vd + 900, easing: 'ease-in' });
            parts.forEach((el, i) => {
                const vv = vec(el);
                const st = i * 60;
                const back = vd + 900 + i * 90;
                const L = back + 1600;
                const o = ms => Math.min(1, ms / L);
                const r = (Math.random() - 0.5) * 24;
                P(el, [
                    { transform: 'none', opacity: 1, offset: 0 },
                    { transform: 'none', opacity: 1, offset: o(st), easing: 'cubic-bezier(.55,0,.75,.4)' },
                    { transform: 'perspective(900px) translate(' + (-vv.dx * vv.d * 0.6).toFixed(0) + 'px,' + (-vv.dy * vv.d * 0.6 + 60).toFixed(0) + 'px) translateZ(-400px) rotate(' + r.toFixed(1) + 'deg)', opacity: 0, offset: o(vd) },
                    { transform: 'translateY(40px) scale(.96)', opacity: 0, offset: o(back), easing: 'cubic-bezier(.2,.9,.3,1)' },
                    { transform: 'translateY(-4px)', opacity: 1, offset: o(back + 800) },
                    { transform: 'none', opacity: 1, offset: 1 }
                ], { duration: L, easing: 'linear' });
            });
            rumble(game, 0, vd, 7);
            (T.hb || []).forEach((ms, i, a) => {
                const k = (i + 1) / a.length;
                reelCrack(ms, 2 + (i >> 1), 'rgba(255,255,255,.9)');
                flash(ms, 300, c2, 0.15 + k * 0.35, 30);
                if (i % 3 === 2) {
                    P(app, [{ filter: 'invert(1)' }, { filter: 'invert(1)', offset: 0.9 }, { filter: 'none' }], { duration: 90, delay: ms, easing: 'steps(1,end)' });
                }
                shake(game, ms, 180, 4 + k * 8, 0);
            });
            // release: the screen itself breaks and falls away
            screenShatter(vd, 650);
            eclipse(vd + 900, 6800, 84, '#ff2a2a', c2);
            raysIn(vd + 900, 7000, 0.5, -140, ['#ff2a2a', c2, '#000', '#ff2a2a', '#000'], 34);
            tear(game, vd + 1000, 1200);
            staticNoise(vd + 900, 3200, 0.22);
            shake(game, vd, 2200, 26, 1.2);
            P(app, [{ filter: 'none' }, { filter: 'grayscale(1) contrast(1.3)', offset: 0.1 }, { filter: 'grayscale(1) contrast(1.3)', offset: 0.7 }, { filter: 'none' }], { duration: 4200, delay: vd + 900, easing: 'ease-in-out' });
            const ed = edge(vd + 900, 7000, '#ff2a2a', 3.4);
            ed.style.boxShadow = 'inset 0 0 0 2px #ff2a2a,inset 0 0 160px 18px #6a0000,inset 0 0 320px 40px #000';
            for (let i = 0; i < 4; i++) {
                ringIn(vd + 1400 + i * 600, 1500, 22 - i * 3, i % 2 ? '#ff2a2a' : '#fff');
            }
            particles([
                { type: 'stars', at: 0, n: 140, cols: ['#ffffff', '#ffd6d6'], life: vd / 1000 * 0.75, size: 1.6, pull: 60, rot: -0.12 },
                { type: 'spiral', at: 800, until: vd, rate: 70, ramp: 1, cols: ['#ff2a2a', '#fff'], life: 1.5, size: 2, dir: -1 },
                { type: 'spiral', at: vd + 1000, until: vd + 6400, rate: 90, cols: ['#ff2a2a', '#ff8a6a', '#fff'], life: 1.7, size: 2.2, dir: -1 },
                Object.assign({ at: vd + 1200, until: vd + 7400, rate: 45, life: 3.6, size: 3, wide: 1 }, ash)
            ], vd + 7600);
        }
        // secret 10-12
        if (tier === 10) {
            // failed supernova
            const v = veil(0, vd + 1200, 0.9, [vd / (vd + 1200) * 0.7, vd / (vd + 1200)], '14,0,2', 6);
            v.style.mixBlendMode = 'multiply';
            if (app) {
                app.style.transformOrigin = origin(app);
            }
            P(app, [{ transform: 'none' }, { transform: 'scale(.9)', offset: 0.95 }, { transform: 'scale(.86) rotate(-1deg)' }], { duration: vd, easing: 'cubic-bezier(.5,0,.9,.5)' });
            rumble(game, 0, vd, 6);
            (T.hb || []).forEach((ms, i, a) => {
                const k = (i + 1) / a.length;
                bloom(ms, 500, 8 + k * 14, i % 2 ? c2 : c, 0.35 + k * 0.4);
                flash(ms, 260, c, 0.08 + k * 0.18, 24);
                reelCrack(ms, 1 + (i >> 1), 'rgba(255,255,255,.85)');
                shake(game, ms, 140, 3 + k * 7, 0);
            });
            blackout(vd, 520, 1);
            eclipse(vd + 260, 6800, 48, c, c2);
            raysIn(vd + 260, 6400, 0.55, -200, [c, '#000', c2, '#000', '#ff8a6a'], 40);
            cracks(vd + 300, 420, 18, Math.hypot(W, H) * 0.9, 'rgba(255,255,255,.88)', 1.5, null, null, 6200);
            shards(vd + 300, 40, 700, 'rgba(60,0,0,.9)');
            shake(game, vd + 260, 2000, 24, 1.1);
            slip(vd + 400, 3600, 34);
            staticNoise(vd + 600, 3000, 0.2);
            P(app, [{ filter: 'none' }, { filter: 'grayscale(1) contrast(1.4)', offset: 0.1 }, { filter: 'grayscale(1) contrast(1.4)', offset: 0.75 }, { filter: 'none' }], { duration: 4800, delay: vd + 300, easing: 'ease-in-out' });
            const ed = edge(vd + 260, 7400, c, 3.2);
            ed.style.boxShadow = 'inset 0 0 0 2px ' + c + ',inset 0 0 150px 16px #4a0006,inset 0 0 320px 40px #000';
            particles([
                { type: 'spiral', at: 400, until: vd, rate: 70, ramp: 1, cols: [c, '#ffb08a', '#fff'], life: 1.4, size: 2, dir: -1 },
                { type: 'spiral', at: vd + 300, until: vd + 6400, rate: 110, cols: [c, '#ff8a6a', '#fff'], life: 1.5, size: 2.2, dir: -1 },
                Object.assign({ at: vd + 800, until: vd + 7600, rate: 50, life: 3.6, size: 3, wide: 1 }, ash)
            ], vd + 7800);
        }
        if (tier === 11) {
            // black hole, gives back the wrong page
            const v = E('fx-fill', 'background:radial-gradient(circle at ' + cx + 'px ' + cy + 'px,rgba(0,0,0,.2) 0,rgba(10,0,2,.96) 34%,#000 100%)');
            A(v, [{ opacity: 0 }, { opacity: 0.7, offset: 0.3 }, { opacity: 1, offset: 0.62 }, { opacity: 1, offset: 0.9 }, { opacity: 0 }], { duration: vd + 2200, easing: 'ease-in' });
            const back = vd + 1700;
            parts.forEach((el, i) => {
                const vv = vec(el);
                const L = back + 2600;
                const o = ms => Math.min(1, ms / L);
                const turn = (i % 2 ? 1 : -1) * (160 + Math.random() * 160);
                const wrong = (Math.random() - 0.5) * 16;
                P(el, [
                    { transform: 'none', opacity: 1, offset: 0 },
                    { transform: 'none', opacity: 1, offset: o(i * 90), easing: 'cubic-bezier(.6,0,.9,.4)' },
                    { transform: 'translate(' + (-vv.dx * vv.d).toFixed(0) + 'px,' + (-vv.dy * vv.d).toFixed(0) + 'px) rotate(' + turn.toFixed(0) + 'deg) scale(.05)', opacity: 0, offset: o(vd * 0.92) },
                    { transform: 'translate(' + (-vv.dx * vv.d).toFixed(0) + 'px,' + (-vv.dy * vv.d).toFixed(0) + 'px) scale(.05)', opacity: 0, offset: o(back) },
                    { transform: 'translate(' + (vv.dx * 30).toFixed(0) + 'px,' + (20 + Math.random() * 40).toFixed(0) + 'px) rotate(' + wrong.toFixed(1) + 'deg) scale(1.02)', opacity: 0.85, offset: o(back + 350), easing: 'steps(1,end)' },
                    { transform: 'translate(' + (vv.dx * 26).toFixed(0) + 'px,' + (24 + Math.random() * 40).toFixed(0) + 'px) rotate(' + (wrong * 1.1).toFixed(1) + 'deg)', opacity: 0.85, offset: o(back + 1900), easing: 'cubic-bezier(.3,1.5,.4,1)' },
                    { transform: 'none', opacity: 1, offset: 1 }
                ], { duration: L, easing: 'linear' });
            });
            raysIn(0, vd, 0.6, -900, [c, '#000', '#ff2a2a', '#000'], 60);
            warpFx(tok, 400, vd, 16, 'ripple');
            eclipse(300, vd + 3400, 34, c, c2);
            (T.hb || []).forEach((ms, i, a) => {
                const k = (i + 1) / a.length;
                ringIn(ms, 900, 6 + k * 8, i % 2 ? '#ff2a2a' : '#fff');
                flash(ms, 200, '#ff2a2a', 0.06 + k * 0.14, 22);
            });
            staticNoise(vd, 1700, 0.32);
            flicker(vd + 200, 1400, 0.85);
            tear(game, back + 300, 1500);
            P(app, [{ filter: 'invert(1) hue-rotate(160deg)' }, { filter: 'invert(1) hue-rotate(160deg)', offset: 0.9 }, { filter: 'none' }], { duration: 130, delay: back + 350, easing: 'steps(1,end)' });
            P(app, [{ filter: 'none' }, { filter: 'saturate(.2) contrast(1.3) sepia(.4)', offset: 0.1 }, { filter: 'saturate(.2) contrast(1.3) sepia(.4)', offset: 0.8 }, { filter: 'none' }], { duration: 3000, delay: back + 500, easing: 'ease-in-out' });
            cracks(back + 300, 320, 12, Math.hypot(W, H) * 0.8, 'rgba(255,40,60,.9)', 1.4, null, null, 4200);
            shake(game, back + 300, 1400, 18, 1);
            const ed = edge(back, 5200, '#ff2a2a', 3);
            ed.style.boxShadow = 'inset 0 0 0 2px #ff2a2a,inset 0 0 140px 14px #3a0010,inset 0 0 300px 40px #000';
            particles([
                { type: 'spiral', at: 0, until: vd, rate: 120, ramp: 1, cols: ['#ff2a2a', '#7a0010', '#fff'], life: 1.2, size: 2, dir: -1 },
                { type: 'stars', at: 0, n: 120, cols: ['#ffd6d6', '#ffffff'], life: vd / 1000 * 0.8, size: 1.5, pull: 160, rot: -0.4 },
                Object.assign({ at: back, until: back + 5200, rate: 46, life: 3.4, size: 3, wide: 1 }, ash)
            ], back + 5600);
        }
        if (tier === 12) {
            // heat death
            P(app, [{ filter: 'none' }, { filter: 'grayscale(.6) blur(.6px) brightness(.85)', offset: 0.6 }, { filter: 'grayscale(1) blur(1.4px) brightness(.55)' }], { duration: vd, easing: 'ease-in' });
            if (app) {
                app.style.transformOrigin = origin(app);
            }
            P(app, [{ transform: 'none' }, { transform: 'scale(.97)' }], { duration: vd, easing: 'ease-in' });
            const v = veil(0, vd + 2000, 0.9, [vd / (vd + 2000) * 0.8, (vd + 1600) / (vd + 2000)], '6,6,6', 10);
            reelFx(b => {
                const f = E('fx-fill', 'inset:auto;left:' + b.left + 'px;top:' + b.top + 'px;width:' + b.width + 'px;height:' + b.height + 'px;box-shadow:inset 0 0 40px 10px rgba(235,240,255,.55),0 0 0 1px rgba(235,240,255,.5)');
                A(f, [{ opacity: 0 }, { opacity: 1, offset: 0.9 }, { opacity: 0 }], { duration: vd + 600, easing: 'ease-in' });
            });
            (T.hb || []).forEach((ms, i, a) => {
                const k = 1 - i / a.length;
                ring(ms, 1400, 4 + k * 4, 'rgba(216,210,200,.7)', 1, 8, 0.6);
                shake(game, ms, 200, 2 + k * 3, 0);
            });
            flash(vd - 500, 700, c2, 0.5, 60);
            blackout(vd, 2400, 1);
            P(app, [{ filter: 'grayscale(1) brightness(.6)' }, { filter: 'grayscale(1) brightness(.8)', offset: 0.35 }, { filter: 'none' }], { duration: 5200, delay: vd + 1500, easing: 'ease-in' });
            const ed = edge(vd + 1500, 6800, c, 2.6);
            ed.style.boxShadow = 'inset 0 0 0 1px ' + c + ',inset 0 0 160px 18px rgba(40,0,0,.6),inset 0 0 320px 50px #000';
            eclipse(vd + 1800, 6200, 40, c, c2);
            particles([
                { type: 'stars', at: 0, n: 160, cols: ['#ffffff', '#d8d2c8', '#9a948a'], life: vd / 1000 * 0.95, size: 1.5, pull: 10, rot: 0.02 },
                Object.assign({ at: 300, until: vd + 7600, rate: 34, life: 4.2, size: 3, wide: 1 }, ash),
                { type: 'embers', at: vd + 1800, until: vd + 6400, rate: 10, cols: ['#ff5a3a', '#7a1000'], life: 2.6, size: 1.6, wide: 1 }
            ], vd + 8000);
        }
        done();
        return;
    }
    // the tiers
    if (tier === 1) {
        sweep(0, 1100, c);
        ring(80, 1300, 5, c, 1.2, 10);
        reelGlow(0, 1200, c, 1.012);
        particles([{ type: 'burst', at: 60, n: 24, cols: [c, '#fff'], speed: 260, life: 1.1, size: 1.6, drag: 2.8 }]);
    }
    if (tier === 2) {
        trace(0, 1500, c, 1, 2);
        sweep(250, 1100, c);
        reelGlow(0, 1500, c, 1.03);
        ring(120, 1500, 7, c, 1.5, 14);
        ring(320, 1500, 9, c2, 1, 10);
        flash(80, 900, c2, 0.35, 45);
        particles([{ type: 'burst', at: 80, n: 46, cols: [c, c2, '#fff'], speed: 380, life: 1.4, size: 1.8, trail: 1 }]);
    }
    if (tier === 3) {
        veil(0, 2700, 0.55, [0.15, 0.7], '6,8,16', 16);
        dof(0, 2700, 4, 0.45);
        trace(0, 1800, c, 1.5, 3);
        reelGlow(0, 2400, c, 1.05);
        bloom(150, 1500, 70, c, 0.6);
        ring(150, 1700, 9, c, 2, 18);
        ring(380, 1800, 12, c2, 1.2, 12);
        particles([
            { type: 'burst', at: 150, n: 80, cols: [c, c2, '#fff'], speed: 460, life: 1.8, size: 2, trail: 1 },
            { type: 'burst', at: 500, n: 30, cols: [c, '#fff'], speed: 160, life: 2.2, size: 1.4, drag: 1.2, grav: -20 }
        ]);
    }
    if (tier === 4) {
        veil(0, 3300, 0.6, [0.1, 0.65], '10,4,14', 14);
        flash(0, 700, '#fff', 0.5, 35);
        bloom(0, 1600, 90, c, 0.75);
        ring(0, 1500, 14, '#fff', 2.5, 22);
        ring(140, 1800, 16, c, 1.5, 16);
        ring(300, 2000, 18, c2, 1, 12);
        rays(100, 3000, 0.35, 40, [c, c2, c, '#fff', c2], 30);
        shockPage(40, 34, 1.2, 1.4);
        reelGlow(0, 2600, c, 1.06);
        trace(200, 2000, c, 2, 3);
        edge(0, 2600, c2, 1.4);
        particles([
            { type: 'burst', at: 0, n: 140, cols: [c, c2, '#fff'], speed: 620, life: 1.9, size: 2.1, trail: 1 },
            { type: 'burst', at: 260, n: 50, cols: [c, '#fff'], speed: 220, life: 2.6, size: 1.5, drag: 1, grav: -16 }
        ]);
    }
    if (tier === 5) {
        bars(0, 4200, 7);
        veil(0, 4200, 0.62, [0.1, 0.72], '14,9,2', 14);
        // the page tips back, as if looking up into the light
        P(app, [
            { transform: 'none' },
            { transform: 'perspective(1100px) rotateX(9deg) scale(.95)', offset: 0.28 },
            { transform: 'perspective(1100px) rotateX(7deg) scale(.955)', offset: 0.6 },
            { transform: 'none' }
        ], { duration: 4000, easing: 'cubic-bezier(.3,.1,.2,1)' });
        if (app) {
            app.style.transformOrigin = '50% ' + (cy - app.getBoundingClientRect().top) + 'px';
        }
        dof(200, 3600, 2, 0.6);
        // shafts of light falling from above
        for (let i = 0; i < 6; i++) {
            const x = cx + (i - 2.5) * Math.min(W, 900) * 0.13 + (Math.random() - 0.5) * 30;
            const s = E('fx-shaft', 'left:' + x + 'px;width:' + (60 + Math.random() * 90) + 'px;background:linear-gradient(180deg,' + c + ',transparent 85%)');
            A(s, [{ opacity: 0, transform: 'translateX(-50%) skewX(' + (i - 2.5) * 4 + 'deg) scaleY(0)' }, { opacity: 0.45, transform: 'translateX(-50%) skewX(' + (i - 2.5) * 4 + 'deg) scaleY(1)', offset: 0.3 }, { opacity: 0.3, offset: 0.7 }, { opacity: 0 }], { duration: 3600, delay: 120 + i * 90, easing: 'ease-out' });
        }
        bloom(0, 2200, 110, c, 0.85);
        flash(0, 900, '#fff', 0.45, 40);
        rays(80, 3800, 0.42, 30, [c, c2, '#fff', c, c2], 40);
        ring(0, 1800, 16, '#fff', 2.5, 24);
        ring(200, 2200, 20, c, 1.5, 18);
        reelGlow(0, 3600, c, 1.07);
        trace(100, 2600, c, 2, 3);
        edge(0, 3600, c2, 1.8);
        particles([
            { type: 'burst', at: 0, n: 150, cols: [c, c2, '#fff'], speed: 560, life: 2, size: 2.2, trail: 1, grav: 30 },
            { type: 'embers', at: 150, until: 3600, rate: 46, cols: [c, c2, '#ffe8a8'], life: 2.4, size: 2.2 }
        ]);
    }
    if (tier === 6) {
        bars(0, 5000, 8);
        veil(0, 5000, 0.7, [0.06, 0.7], '16,5,2', 12);
        flash(0, 1100, '#fff', 0.85, 60);
        flash(0, 2400, c2, 0.5, 80);
        bloom(0, 2400, 130, c, 0.95);
        ring(0, 1600, 22, '#fff', 3, 28);
        ring(90, 2000, 24, c, 2, 22);
        ring(240, 2400, 26, c2, 1.2, 16);
        rays(0, 4600, 0.5, 50, [c, c2, '#ffd6a0', c2], 34);
        shake(game, 0, 1200, 16, 0.6);
        shockPage(30, 46, 2.2, 1.8);
        warpFx(tok, 120, 2600, 12, 'heat');
        reels.forEach(r => P(r, [
            { filter: 'none' },
            { filter: 'drop-shadow(5px 0 0 rgba(255,40,40,.75)) drop-shadow(-5px 0 0 rgba(40,220,255,.75))', offset: 0.06 },
            { filter: 'drop-shadow(1px 0 0 rgba(255,40,40,.4)) drop-shadow(-1px 0 0 rgba(40,220,255,.4))', offset: 0.3 },
            { filter: 'none' }
        ], { duration: 1600, easing: 'ease-out' }));
        reelGlow(0, 4200, c, 1.08);
        trace(150, 3000, c, 3, 3);
        edge(0, 4400, c2, 2.2);
        particles([
            { type: 'burst', at: 0, n: 220, cols: [c, c2, '#fff', '#ffd166'], speed: 780, life: 2.2, size: 2.3, trail: 1, grav: 120, drag: 1.8 },
            { type: 'embers', at: 200, until: 4400, rate: 60, cols: [c, c2, '#ffd6a0'], life: 2.4, size: 2.4, wide: 1 }
        ]);
    }
    if (tier === 7) {
        bars(0, 5800, 9);
        veil(0, 5800, 0.74, [0.05, 0.72], '18,2,8', 12);
        // first impact
        flash(0, 900, '#fff', 0.7, 50);
        bloom(0, 1600, 100, c, 0.8);
        ring(0, 1300, 18, '#fff', 2.5, 22);
        shake(game, 0, 380, 12, 0.5);
        // second impact: the page flashes to its negative and scatters
        P(app, [
            { filter: 'none' },
            { filter: 'invert(1) hue-rotate(180deg) contrast(1.2)', offset: 0.02 },
            { filter: 'invert(1) hue-rotate(180deg) contrast(1.2)', offset: 0.12 },
            { filter: 'none', offset: 0.22 },
            { filter: 'none' }
        ], { duration: 900, delay: 340, easing: 'linear' });
        flash(340, 1600, '#fff', 0.95, 70);
        flash(340, 3000, c2, 0.55, 90);
        bloom(340, 2800, 150, c, 1);
        ring(340, 1700, 26, '#fff', 3.5, 30);
        ring(440, 2100, 28, c, 2, 22);
        ring(600, 2500, 30, c2, 1.2, 16);
        rays(340, 5200, 0.55, -60, [c, c2, '#fff', c2, c], 30);
        rays(340, 5200, 0.3, 50, [c2, c], 18, 140);
        shake(game, 340, 1500, 22, 1);
        shockPage(360, 70, 5, 2.2);
        warpFx(tok, 400, 2400, 18, 'ripple');
        reelGlow(340, 4800, c, 1.09);
        trace(400, 3200, c, 3, 4);
        edge(340, 5000, c2, 2.6);
        particles([
            { type: 'burst', at: 0, n: 90, cols: [c, '#fff'], speed: 520, life: 1.4, size: 2, trail: 1 },
            { type: 'burst', at: 340, n: 260, cols: [c, c2, '#fff', '#ffb3c1'], speed: 900, life: 2.4, size: 2.4, trail: 1, grav: 60, drag: 1.7 },
            { type: 'rain', at: 700, until: 5000, rate: 40, cols: [c, '#fff', c2], life: 2, size: 2.2 }
        ]);
    }
    if (tier === 8) {
        // build-up: the page is drawn into the roll window over a heartbeat
        veil(0, vd + 4600, 0.96, [vd / (vd + 4600) * 0.85, (vd + 1400) / (vd + 4600)], '4,2,14', 4);
        if (app) {
            app.style.transformOrigin = origin(app);
        }
        {
            const L = vd + 1800;
            const o = ms => ms / L;
            P(app, [
                { transform: 'none', easing: 'cubic-bezier(.5,0,.8,.6)' },
                { transform: 'scale(.86) rotate(-1.2deg)', offset: o(vd * 0.92) },
                { transform: 'scale(.84) rotate(-1.4deg)', offset: o(vd), easing: 'cubic-bezier(.2,.9,.25,1)' },
                { transform: 'scale(1.035) rotate(.3deg)', offset: o(vd + 220) },
                { transform: 'scale(.995)', offset: o(vd + 600) },
                { transform: 'none' }
            ], { duration: L, easing: 'linear' });
        }
        rumble(game, 0, vd, 4);
        (T.hb || []).forEach((ms, i, a) => {
            const k = (i + 1) / a.length;
            flash(ms, 520, c2, 0.15 + k * 0.25, 40);
            ring(ms, 900, 3 + k * 3, c, 1.5, 14, 0.5);
        });
        ringIn(0, vd * 0.7, 14, c);
        ringIn(vd * 0.3, vd * 0.7, 12, c2);
        // release
        flash(vd, 1400, '#fff', 0.95, 75);
        bloom(vd, 3000, 170, c, 1);
        ring(vd, 1700, 30, '#fff', 3.5, 34);
        ring(vd + 100, 2200, 32, c, 2, 24);
        ring(vd + 260, 2600, 34, c2, 1.4, 18);
        rays(vd, 5200, 0.55, 70, [c, c2, '#fff', c, c2], 36);
        aurora(vd + 200, 5200, [c2, c, '#7de0ff'], 0.4);
        shake(game, vd, 1300, 14, 0.6);
        reelGlow(vd, 4800, c, 1.08);
        trace(vd + 100, 3400, c, 3, 4);
        edge(vd, 5200, c2, 3);
        particles([
            { type: 'spiral', at: 0, until: vd, rate: 85, ramp: 1, cols: [c, c2, '#fff'], life: 1.4, size: 2 },
            { type: 'burst', at: vd, n: 210, cols: [c, c2, '#fff', '#7de0ff'], speed: 980, life: 2.6, size: 2.4, trail: 1, drag: 1.6 },
            { type: 'burst', at: vd + 300, n: 80, cols: [c, '#fff'], speed: 300, life: 3.4, size: 1.6, drag: 0.9, grav: -10 }
        ]);
    }
    if (tier === 9) {
        // build-up: the page comes apart and drifts toward the roll window, into a starfield
        const v = E('fx-fill', 'background:radial-gradient(circle at ' + cx + 'px ' + cy + 'px,rgba(10,4,26,.5) 0,rgba(3,1,10,.97) 32%,#010004 100%)');
        const d = vd + 900;
        A(v, [{ opacity: 0 }, { opacity: 0.55, offset: 0.25 }, { opacity: 0.97, offset: vd / d * 0.95 }, { opacity: 1, offset: vd / d }, { opacity: 0 }], { duration: d, easing: 'ease-in' });
        parts.forEach((el, i) => {
            const vv = vec(el);
            const r = (Math.random() - 0.5) * 30;
            const z = -200 - Math.random() * 500;
            const st = i * 60;
            const back = vd + 250 + i * 70;
            const L = back + 1500;
            const o = ms => Math.min(1, ms / L);
            const tx = k => 'translate(' + (-vv.dx * vv.d * k).toFixed(0) + 'px,' + (-vv.dy * vv.d * k).toFixed(0) + 'px)';
            P(el, [
                { transform: 'none', opacity: 1, offset: 0 },
                { transform: 'none', opacity: 1, offset: o(st), easing: 'cubic-bezier(.55,0,.75,.4)' },
                { transform: 'perspective(900px) ' + tx(0.15) + ' translateZ(' + (z * 0.3).toFixed(0) + 'px) rotate(' + (r * 0.3).toFixed(1) + 'deg)', opacity: 0.85, offset: o(st + vd * 0.4), easing: 'cubic-bezier(.55,0,.75,.4)' },
                { transform: 'perspective(900px) ' + tx(0.7) + ' translateZ(' + z.toFixed(0) + 'px) rotateX(' + (r * 0.8).toFixed(1) + 'deg) rotate(' + r.toFixed(1) + 'deg)', opacity: 0, offset: o(Math.min(st + vd, back)) },
                { transform: 'perspective(900px) translate(' + (vv.dx * 80).toFixed(0) + 'px,' + (vv.dy * 80).toFixed(0) + 'px) translateZ(200px)', opacity: 0, offset: o(back), easing: 'cubic-bezier(.15,.9,.25,1)' },
                { transform: 'perspective(900px) translate(' + (-vv.dx * 6).toFixed(0) + 'px,' + (-vv.dy * 6).toFixed(0) + 'px)', opacity: 1, offset: o(back + 600) },
                { transform: 'none', opacity: 1, offset: 1 }
            ], { duration: L, easing: 'linear' });
        });
        reels.forEach(r => P(r, [{ transform: 'none' }, { transform: 'scale(1.04)', offset: 0.9 }, { transform: 'scale(.97)' }], { duration: vd, easing: 'ease-in' }));
        reelFx(b => {
            const g = E('fx-fill', 'inset:auto;left:' + b.left + 'px;top:' + b.top + 'px;width:' + b.width + 'px;height:' + b.height + 'px;box-shadow:0 0 0 3px #fff,0 0 90px 24px ' + c2);
            A(g, [{ opacity: 0 }, { opacity: 0.8, offset: 0.85 }, { opacity: 1 }], { duration: vd, easing: 'ease-in' });
        });
        rumble(game, 0, vd, 6);
        (T.hb || []).forEach((ms, i, a) => {
            const k = (i + 1) / a.length;
            flash(ms, 600, i % 2 ? c2 : '#8fb4ff', 0.12 + k * 0.3, 30 + k * 30);
            ring(ms, 1000, 3 + k * 5, i % 2 ? c2 : '#cfe0ff', 1.5, 16, 0.5);
        });
        ringIn(0, vd * 0.6, 16, '#cfe0ff');
        ringIn(vd * 0.25, vd * 0.6, 14, c2);
        ringIn(vd * 0.5, vd * 0.5, 12, '#fff');
        // release: white-out, then prismatic light as the page reforms
        const wo = E('fx-fill', 'background:#fff');
        A(wo, [{ opacity: 0 }, { opacity: 1, offset: 0.04 }, { opacity: 1, offset: 0.12 }, { opacity: 0 }], { duration: 2400, delay: vd - 80, easing: 'ease-out' });
        const prism = ['#ff6b9a', '#ffd36b', '#7dffa0', '#6bdcff', '#a58bff'];
        const r1 = rays(vd, 7000, 0.6, 120, prism, 40);
        for (let i = 0; i < 4; i++) {
            ring(vd + i * 200, 2400 + i * 200, 30 + i * 4, prism[i % 5], 2.5 - i * 0.25, 26);
        }
        aurora(vd + 300, 6800, ['#ff7ad9', '#6bdcff', '#a58bff'], 0.4);
        const ed = edge(vd, 7200, '#fff', 3.2);
        ed.style.boxShadow = 'inset 0 0 0 2px #ff7ad9,inset 0 0 160px 14px #6bdcff,inset 0 0 300px 30px #a58bff';
        bloom(vd, 3600, 200, '#fff6d6', 1);
        flash(vd + 200, 4000, c2, 0.4, 100);
        shake(game, vd + 200, 1600, 18, 0.8);
        trace(vd + 300, 4000, '#fff', 4, 4);
        particles([
            { type: 'stars', at: 0, n: 150, cols: ['#ffffff', '#cfe0ff', '#ffd6f2'], life: vd / 1000 + 0.4, size: 1.6, pull: 120, rot: 0.25 },
            { type: 'spiral', at: 600, until: vd, rate: 100, ramp: 1, cols: ['#cfe0ff', c2, '#fff'], life: 1.5, size: 2, dir: -1 },
            { type: 'galaxy', at: vd, n: 240, cols: 'rainbow', speed: 1100, life: 3.4, size: 2.4, trail: 1, drag: 1.3, spin: 1.6 },
            { type: 'burst', at: vd + 500, n: 100, cols: 'rainbow', speed: 420, life: 4.2, size: 1.7, drag: 0.8, grav: -8 },
            { type: 'embers', at: vd + 800, until: vd + 6000, rate: 26, cols: 'rainbow', life: 2.6, size: 1.8, wide: 1 }
        ]);
    }
    if (tier >= 10) {
        const disc = (delay, dur, size, rim, glow) => {
            const e = E('fx-eclipse', at + 'width:' + size + 'vmin;height:' + size + 'vmin;margin:-' + size / 2 + 'vmin 0 0 -' + size / 2 + 'vmin;box-shadow:0 0 0 2px ' + rim + ',0 0 40px 8px ' + rim + ',0 0 140px 50px ' + glow + ',inset 0 0 30px 4px ' + glow);
            A(e, [{ opacity: 0, transform: 'scale(.1)' }, { opacity: 1, transform: 'scale(1)', offset: 0.35 }, { opacity: 1, transform: 'scale(1.08)', offset: 0.9 }, { opacity: 0, transform: 'scale(.02)' }], { duration: dur, delay, easing: 'cubic-bezier(.4,0,.6,1)' });
            return e;
        };
        const whiteout = (delay, dur) => {
            const wo = E('fx-fill', 'background:#fff');
            A(wo, [{ opacity: 0 }, { opacity: 1, offset: 0.04 }, { opacity: 1, offset: 0.14 }, { opacity: 0 }], { duration: dur, delay, easing: 'ease-out' });
        };
        const prism = ['#ff6b9a', '#ffd36b', '#7dffa0', '#6bdcff', '#a58bff'];
        if (tier === 10) {
            // supernova
            veil(0, vd + 1400, 0.94, [vd / (vd + 1400) * 0.8, vd / (vd + 1400)], '2,4,20', 5);
            if (app) {
                app.style.transformOrigin = origin(app);
            }
            {
                const L = vd + 2200;
                const o = ms => ms / L;
                P(app, [
                    { transform: 'none', easing: 'cubic-bezier(.5,0,.9,.5)' },
                    { transform: 'scale(.88)', offset: o(vd) , easing: 'cubic-bezier(.15,.9,.25,1)' },
                    { transform: 'scale(1.07)', offset: o(vd + 260) },
                    { transform: 'scale(.99)', offset: o(vd + 900) },
                    { transform: 'none' }
                ], { duration: L, easing: 'linear' });
            }
            rumble(game, 0, vd, 5);
            (T.hb || []).forEach((ms, i, a) => {
                const k = (i + 1) / a.length;
                bloom(ms, 700, 6 + k * 22, i % 2 ? c2 : c, 0.4 + k * 0.6);
                ring(ms, 1000, 2 + k * 4, c, 1.5, 14, 0.4);
                flash(ms, 400, c, 0.1 + k * 0.2, 30);
            });
            ringIn(0, vd * 0.8, 18, c);
            ringIn(vd * 0.4, vd * 0.6, 14, c2);
            // blast
            whiteout(vd - 60, 1800);
            bloom(vd, 3200, 220, c, 1);
            for (let i = 0; i < 5; i++) {
                ring(vd + i * 140, 2200 + i * 260, 32 + i * 4, [c, '#fff', c2, '#ff7ad9', c][i], 3.5 - i * 0.5, 30);
            }
            shockPage(vd + 40, 120, 6, 2.8);
            shake(game, vd, 1800, 22, 1);
            warpFx(tok, vd + 100, 2600, 20, 'ripple');
            rays(vd, 6400, 0.55, 90, [c, c2, '#fff', '#ff7ad9', c2], 44);
            aurora(vd + 300, 6800, [c2, c, '#ff7ad9', c], 0.5);
            const ed = edge(vd, 7400, c, 3.2);
            ed.style.boxShadow = 'inset 0 0 0 2px ' + c + ',inset 0 0 160px 16px ' + c2 + ',inset 0 0 320px 40px #10003a';
            reelGlow(vd, 6000, c, 1.1);
            trace(vd + 200, 4200, '#fff', 4, 4);
            particles([
                { type: 'stars', at: 0, n: 140, cols: ['#ffffff', '#bff7ff', '#d6ccff'], life: vd / 1000 * 0.8, size: 1.5, pull: 140, rot: 0.1 },
                { type: 'spiral', at: 500, until: vd, rate: 90, ramp: 1, cols: [c, c2, '#fff'], life: 1.3, size: 2, dir: -1 },
                { type: 'galaxy', at: vd, n: 260, cols: [c, c2, '#fff', '#ff7ad9'], speed: 1250, life: 3.2, size: 2.5, trail: 1, drag: 1.2, spin: 0.6 },
                { type: 'burst', at: vd + 400, n: 90, cols: [c, '#fff'], speed: 380, life: 4, size: 1.7, drag: 0.8, grav: -6 },
                { type: 'embers', at: vd + 700, until: vd + 7000, rate: 30, cols: [c, c2, '#ff7ad9'], life: 2.8, size: 1.9, wide: 1 }
            ], vd + 8000);
        }
        if (tier === 11) {
            // black hole into white hole
            const v = E('fx-fill', 'background:radial-gradient(circle at ' + cx + 'px ' + cy + 'px,rgba(20,0,30,.3) 0,rgba(4,0,10,.96) 34%,#000 100%)');
            A(v, [{ opacity: 0 }, { opacity: 0.7, offset: 0.3 }, { opacity: 1, offset: (vd - 200) / (vd + 700) }, { opacity: 1, offset: vd / (vd + 700) }, { opacity: 0 }], { duration: vd + 700, easing: 'ease-in' });
            parts.forEach((el, i) => {
                const vv = vec(el);
                const L = vd + 2400;
                const o = ms => Math.min(1, ms / L);
                const turn = (i % 2 ? 1 : -1) * (200 + Math.random() * 160);
                const tx = k => 'translate(' + (-vv.dx * vv.d * k).toFixed(0) + 'px,' + (-vv.dy * vv.d * k).toFixed(0) + 'px)';
                P(el, [
                    { transform: 'none', opacity: 1, offset: 0 },
                    { transform: 'none', opacity: 1, offset: o(i * 110), easing: 'cubic-bezier(.6,0,.9,.4)' },
                    { transform: tx(0.5) + ' rotate(' + (turn * 0.3).toFixed(0) + 'deg) scale(.6)', opacity: 0.8, offset: o(i * 110 + vd * 0.45), easing: 'cubic-bezier(.6,0,.9,.4)' },
                    { transform: tx(1) + ' rotate(' + turn.toFixed(0) + 'deg) scale(.04)', opacity: 0, offset: o(vd * 0.94) },
                    { transform: tx(1) + ' scale(.04)', opacity: 0, offset: o(vd + 150) },
                    { transform: 'translate(' + (vv.dx * 70).toFixed(0) + 'px,' + (vv.dy * 70).toFixed(0) + 'px) scale(1.05)', opacity: 1, offset: o(vd + 750), easing: 'cubic-bezier(.2,.9,.3,1)' },
                    { transform: 'none', opacity: 1, offset: 1 }
                ], { duration: L, easing: 'linear' });
            });
            rays(0, vd + 300, 0.6, 1080, [c, '#000', c2, '#000', '#3ff0ff', '#000'], 64, 70);
            warpFx(tok, 300, vd - 200, 18, 'ripple');
            disc(200, vd, 30, c, c2);
            (T.hb || []).forEach((ms, i, a) => {
                const k = (i + 1) / a.length;
                ringIn(ms, 1000, 8 + k * 10, i % 2 ? c2 : c);
                flash(ms, 300, c, 0.05 + k * 0.15, 25);
            });
            // white hole
            whiteout(vd - 40, 2000);
            bloom(vd, 3400, 240, '#fff', 1);
            for (let i = 0; i < 5; i++) {
                ring(vd + i * 160, 2400 + i * 260, 34 + i * 4, ['#fff', c, '#3ff0ff', c2, '#fff'][i], 3.5 - i * 0.5, 32);
            }
            rays(vd, 6800, 0.6, -140, prism, 48);
            rays(vd + 200, 6800, 0.35, 120, [c, c2, '#3ff0ff'], 20, 150);
            aurora(vd + 300, 7200, ['#3ff0ff', c, c2, '#ffd36e'], 0.45);
            shake(game, vd, 1900, 24, 1);
            const ed = edge(vd, 7600, c, 3.4);
            ed.style.boxShadow = 'inset 0 0 0 2px #3ff0ff,inset 0 0 160px 16px ' + c + ',inset 0 0 320px 40px ' + c2;
            trace(vd + 300, 4400, '#fff', 4, 4);
            particles([
                { type: 'spiral', at: 0, until: vd, rate: 130, ramp: 1, cols: [c, c2, '#3ff0ff', '#fff'], life: 1.2, size: 2, dir: -1 },
                { type: 'stars', at: 0, n: 150, cols: ['#ffffff', '#e8d0ff'], life: vd / 1000 * 0.85, size: 1.5, pull: 200, rot: 0.5 },
                { type: 'galaxy', at: vd, n: 300, cols: 'rainbow', speed: 1300, life: 3.4, size: 2.5, trail: 1, drag: 1.2, spin: -1.8 },
                { type: 'burst', at: vd + 500, n: 110, cols: 'rainbow', speed: 460, life: 4.4, size: 1.7, drag: 0.8, grav: -8 },
                { type: 'embers', at: vd + 800, until: vd + 7400, rate: 30, cols: [c, c2, '#3ff0ff', '#fff'], life: 2.8, size: 1.9, wide: 1 }
            ], vd + 8400);
        }
        if (tier === 12) {
            // big bang
            const dark0 = E('fx-fill', 'background:#000');
            A(dark0, [{ opacity: 0 }, { opacity: 1, offset: 1400 / (vd + 300) }, { opacity: 1, offset: vd / (vd + 300) }, { opacity: 0 }], { duration: vd + 300, easing: 'ease-in-out' });
            (T.hb || []).forEach((ms, i, a) => {
                const k = (i + 1) / a.length;
                bloom(ms, 900, 2 + k * 9, i % 2 ? c2 : '#fff', 0.5 + k * 0.5);
                ringIn(ms, 1000, 3 + k * 5, i % 3 === 2 ? c : '#fff');
            });
            whiteout(vd + 120, 2600);
            const sphere = E('fx-bloom', at + 'width:300vmax;height:300vmax;margin:-150vmax 0 0 -150vmax;background:radial-gradient(circle,#fff 0,#fff 30%,' + c + ' 48%,' + c2 + ' 58%,transparent 70%)');
            A(sphere, [{ opacity: 1, transform: 'scale(.002)' }, { opacity: 1, transform: 'scale(1)', offset: 0.3 }, { opacity: 0, transform: 'scale(1.1)' }], { duration: 2200, delay: vd - 200, easing: 'cubic-bezier(.7,0,.3,1)' });
            parts.forEach((el, i) => P(el, [
                { opacity: 0, transform: 'scale(.4)', filter: 'blur(14px) brightness(3)' },
                { opacity: 1, transform: 'scale(1.03)', filter: 'blur(2px) brightness(1.4)', offset: 0.6 },
                { opacity: 1, transform: 'none', filter: 'none' }
            ], { duration: 1200, delay: vd + 1200 + i * 220, easing: 'cubic-bezier(.2,.8,.3,1)', fill: 'backwards' }));
            rays(vd + 300, 8200, 0.6, 160, prism, 52);
            rays(vd + 500, 8200, 0.4, -120, [c, c2, '#7a5cff', '#3ff0ff'], 24, 160);
            aurora(vd + 600, 8400, [c, c2, '#7a5cff', '#3ff0ff'], 0.5);
            for (let i = 0; i < 6; i++) {
                ring(vd + 400 + i * 220, 2600 + i * 240, 36 + i * 3, i % 2 ? prism[i % 5] : c, 3.5 - i * 0.4, 32);
            }
            shake(game, vd + 100, 2200, 26, 1.2);
            trace(vd + 2400, 5600, c, 5, 5);
            reelGlow(vd + 2400, 6000, c, 1.1);
            const ed = edge(vd + 300, 8800, c, 3.6);
            ed.style.boxShadow = 'inset 0 0 0 2px ' + c + ',inset 0 0 140px 14px ' + c2 + ',inset 0 0 260px 30px #7a5cff,inset 0 0 380px 50px #0a3a5a';
            particles([
                { type: 'galaxy', at: vd + 200, n: 320, cols: 'rainbow', speed: 1500, life: 3.8, size: 2.6, trail: 1, drag: 1.1, spin: 1.2 },
                { type: 'burst', at: vd + 900, n: 140, cols: [c, '#fff', c2], speed: 600, life: 4.6, size: 1.9, drag: 0.8, grav: -6 },
                { type: 'stars', at: vd + 1400, n: 160, cols: ['#ffffff', '#fff2c4', '#ffd6f2'], life: 6, size: 1.5, pull: -40, rot: 0.06 },
                { type: 'embers', at: vd + 1200, until: vd + 9200, rate: 34, cols: 'rainbow', life: 3, size: 1.9, wide: 1 }
            ], vd + 10200);
        }
    }
    done();
}
const prefersReducedMotion = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
function warpFx(tok, delay, dur, peak, mode) {
    if (prefersReducedMotion()) {
        return;
    }
    const turb = $('fxTurb');
    const disp = $('fxDisp');
    if (!turb || !disp) {
        return;
    }
    const clear = () => {
        document.body.classList.remove('fx-warping');
        disp.setAttribute('scale', '0');
    };
    setTimeout(() => {
        if (tok !== fxRunId) {
            return;
        }
        document.body.classList.add('fx-warping');
        const t0 = performance.now();
        (function f(now) {
            if (tok !== fxRunId) {
                clear();
                return;
            }
            const t = Math.max(0, now - t0);
            if (t > dur) {
                clear();
                return;
            }
            const e = Math.pow(Math.sin(Math.PI * t / dur), 0.7);
            disp.setAttribute('scale', (peak * e).toFixed(1));
            turb.setAttribute('baseFrequency', mode === 'heat' ? (0.012 + Math.sin(t / 700) * 0.003).toFixed(4) + ' ' + (0.05 + Math.sin(t / 140) * 0.012).toFixed(4) : (0.004 + Math.sin(t / 1100) * 0.0025).toFixed(4) + ' ' + (0.007 + Math.cos(t / 900) * 0.003).toFixed(4));
            requestAnimationFrame(f);
        })(performance.now());
    }, delay);
}
// retro + astral spawn effects

// canvas over the page. o.px draws at low res for retro
function fxScene(k, dur, draw, o) {
    o = o || {};
    const cv = document.createElement('canvas');
    cv.className = 'fx fx-canvas';
    k.ov.appendChild(cv);
    const W = innerWidth;
    const H = innerHeight;
    const px = o.px || 0;
    let g;
    let out;
    let buf;
    let lines;
    if (px) {
        buf = document.createElement('canvas');
        buf.width = Math.ceil(W / px);
        buf.height = Math.ceil(H / px);
        g = buf.getContext('2d');
        cv.width = W;
        cv.height = H;
        out = cv.getContext('2d');
        out.imageSmoothingEnabled = false;
        if (o.scan) {
            // scanlines
            const s = document.createElement('canvas');
            s.width = 1;
            s.height = px;
            const x = s.getContext('2d');
            x.fillStyle = 'rgba(0,0,0,.28)';
            x.fillRect(0, px - 1, 1, 1);
            lines = out.createPattern(s, 'repeat');
        }
    } else {
        const dpr = Math.min(1.5, devicePixelRatio || 1);
        cv.width = W * dpr;
        cv.height = H * dpr;
        g = cv.getContext('2d');
        g.scale(dpr, dpr);
    }
    const t0 = performance.now();
    (function f(now) {
        if (k.tok !== fxRunId) {
            return;
        }
        const t = now - t0;
        if (px) {
            g.clearRect(0, 0, buf.width, buf.height);
            draw(g, t, buf.width, buf.height);
            out.clearRect(0, 0, W, H);
            out.drawImage(buf, 0, 0, buf.width * px, buf.height * px);
            if (lines) {
                out.fillStyle = lines;
                out.fillRect(0, 0, W, H);
            }
        } else {
            g.clearRect(0, 0, W, H);
            draw(g, t, W, H);
        }
        if (t < dur) {
            requestAnimationFrame(f);
        } else {
            cv.remove();
        }
    })(t0);
}
// 0..1 between a and b
const fxK = (t, a, b) => Math.max(0, Math.min(1, (t - a) / (b - a)));
const fxEnv = (t, a, b, i, o) => t < a || t > b ? 0 : Math.min(1, (t - a) / (i || 1), (b - t) / (o || 1));
// reduce flashing
const fxFlash = a => calmFx ? Math.min(0.3, a * 0.35) : a;
const fxStep = (x, n) => calmFx ? x : Math.floor(x * n) / n;

// retro
const RETRO_PAL = [
    null,
    ['#5fcde4', '#306082', '#ffffff'],
    ['#6abe30', '#37946e', '#cbdbfc'],
    ['#9b6bff', '#5b37c9', '#ffffff', '#cbdbfc'],
    ['#ff77a8', '#b13e8a', '#ffffff', '#ffccaa'],
    ['#fbf236', '#df7126', '#ffffff', '#8f563b'],
    ['#ff8a2a', '#d0302a', '#fbf236', '#ffffff'],
    ['#ff004d', '#7e2553', '#ffffff', '#29adff'],
    ['#c2c3ff', '#5b37c9', '#ffffff', '#ff77a8'],
    ['#fff1e8', '#ff77a8', '#29adff', '#fbf236', '#00e436'],
    ['#29f0ff', '#7a5cff', '#ffffff', '#ff77a8'],
    ['#c45cff', '#ff4fd8', '#29f0ff', '#ffffff'],
    ['#ffd36e', '#ff77a8', '#29adff', '#00e436', '#ffffff', '#7a5cff']
];
const RAINBOW8 = ['#ff004d', '#ffa300', '#ffec27', '#00e436', '#29adff', '#83769c', '#ff77a8'];
// bayer 4x4
function ditherFill(g, col, level) {
    ditherFill.c = ditherFill.c || {};
    const key = col + level;
    if (!ditherFill.c[key]) {
        const B = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5];
        const s = document.createElement('canvas');
        s.width = s.height = 4;
        const x = s.getContext('2d');
        x.fillStyle = col;
        B.forEach((v, i) => {
            if (v < level) {
                x.fillRect(i % 4, i >> 2, 1, 1);
            }
        });
        ditherFill.c[key] = s;
    }
    return g.createPattern(ditherFill.c[key], 'repeat');
}
// midpoint circle
function pxCircle(g, x0, y0, r, col, th) {
    g.fillStyle = col;
    for (let w = 0; w < (th || 1); w++) {
        let x = Math.round(r) + w;
        let y = 0;
        let e = 1 - x;
        while (x >= y) {
            [[x, y], [y, x], [-y, x], [-x, y], [-x, -y], [-y, -x], [y, -x], [x, -y]].forEach(([a, b]) => g.fillRect(Math.round(x0 + a), Math.round(y0 + b), 1, 1));
            y++;
            if (e < 0) {
                e += 2 * y + 1;
            } else {
                x--;
                e += 2 * (y - x) + 1;
            }
        }
    }
}
function pxDisc(g, x0, y0, r, fill, sx) {
    g.fillStyle = fill;
    r = Math.round(r);
    for (let dy = -r; dy <= r; dy++) {
        const w = Math.floor(Math.sqrt(r * r - dy * dy) * (sx == null ? 1 : sx));
        g.fillRect(Math.round(x0 - w), Math.round(y0 + dy), w * 2 + 1, 1);
    }
}
function pxLine(g, x0, y0, x1, y1, col) {
    g.fillStyle = col;
    x0 = Math.round(x0);
    y0 = Math.round(y0);
    x1 = Math.round(x1);
    y1 = Math.round(y1);
    const dx = Math.abs(x1 - x0);
    const dy = -Math.abs(y1 - y0);
    const sx = x0 < x1 ? 1 : -1;
    const sy = y0 < y1 ? 1 : -1;
    let e = dx + dy;
    for (let n = 0; n < 4000; n++) {
        g.fillRect(x0, y0, 1, 1);
        if (x0 === x1 && y0 === y1) {
            break;
        }
        const e2 = 2 * e;
        if (e2 >= dy) {
            e += dy;
            x0 += sx;
        }
        if (e2 <= dx) {
            e += dx;
            y0 += sy;
        }
    }
}
function pxTwinkle(g, x, y, s, col) {
    x = Math.round(x);
    y = Math.round(y);
    g.fillStyle = col;
    g.fillRect(x, y - s, 1, s * 2 + 1);
    g.fillRect(x - s, y, s * 2 + 1, 1);
    if (s > 2) {
        g.fillStyle = '#fff';
        g.fillRect(x - 1, y - 1, 3, 3);
    }
}
function pxCoin(g, x, y, r, spin) {
    const sx = Math.abs(Math.cos(spin));
    pxDisc(g, x, y, r, '#df7126', Math.max(0.15, sx));
    pxDisc(g, x, y, r - 1, '#fbf236', Math.max(0.1, sx * 0.85));
    if (sx > 0.4) {
        g.fillStyle = '#fff';
        g.fillRect(Math.round(x - r * sx * 0.4), Math.round(y - r * 0.5), 1, Math.max(1, Math.round(r * 0.6)));
    }
}
// lightning
function pxBolt(g, x0, y0, x1, y1, col, seed, jag) {
    let s = seed;
    const rnd = () => (s = (s * 9301 + 49297) % 233280) / 233280;
    const n = 9;
    let px = x0;
    let py = y0;
    for (let i = 1; i <= n; i++) {
        const f = i / n;
        const x = i === n ? x1 : x0 + (x1 - x0) * f + (rnd() - 0.5) * (jag || 16);
        const y = i === n ? y1 : y0 + (y1 - y0) * f;
        pxLine(g, px, py, x, y, col);
        pxLine(g, px + 1, py, x + 1, y, col);
        px = x;
        py = y;
    }
}
// pixel particles
function pxBits() {
    const L = [];
    return {
        burst(x, y, n, pal, speed, o) {
            o = o || {};
            for (let i = 0; i < n; i++) {
                const a = o.ring ? i / n * 6.2832 : Math.random() * 6.2832;
                const sp = speed * (o.ring ? 1 : 0.25 + Math.random() * 0.75);
                L.push({ x, y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, g: o.grav || 0, col: pal[i % pal.length], life: (o.life || 1) * (0.7 + Math.random() * 0.6), age: 0, s: o.size || 1, tw: o.twinkle, drag: o.drag == null ? 1.5 : o.drag, coin: o.coin, spin: Math.random() * 6 });
            }
        },
        add(p) {
            L.push(Object.assign({ age: 0, g: 0, drag: 0, s: 1, life: 1 }, p));
        },
        draw(g, dt) {
            for (let i = L.length; i--;) {
                const p = L[i];
                p.age += dt;
                if (p.age >= p.life) {
                    L.splice(i, 1);
                    continue;
                }
                const d = Math.exp(-p.drag * dt);
                p.vx *= d;
                p.vy = p.vy * d + p.g * dt;
                p.x += p.vx * dt;
                p.y += p.vy * dt;
                // blink before they go
                if (p.age > p.life * 0.66 && Math.floor(p.age * 16) % 2 && !calmFx) {
                    continue;
                }
                if (p.coin) {
                    pxCoin(g, p.x, p.y, p.s, p.spin + p.age * 9);
                } else if (p.tw) {
                    pxTwinkle(g, p.x, p.y, Math.max(1, Math.round(p.s * (1 - p.age / p.life))), p.col);
                } else {
                    g.fillStyle = p.col;
                    g.fillRect(Math.round(p.x), Math.round(p.y), p.s, p.s);
                }
            }
        },
        get n() {
            return L.length;
        }
    };
}
function retroShake(k, el, delay, dur, amp) {
    const fr = [];
    const n = Math.max(6, Math.round(dur / 70));
    for (let i = 0; i <= n; i++) {
        const f = Math.pow(1 - i / n, 1.4);
        fr.push({ transform: i === 0 || i === n ? 'none' : 'translate(' + Math.round((Math.random() - 0.5) * 2 * amp * f / 4) * 4 + 'px,' + Math.round((Math.random() - 0.5) * 2 * amp * f / 4) * 4 + 'px)' });
    }
    k.P(el, fr, { duration: dur, delay, easing: calmFx ? 'linear' : 'steps(' + n + ')' });
}
function retroFx(tier, k) {
    const { T, vd, total } = k;
    const pal = RETRO_PAL[tier];
    const PX = Math.max(3, Math.round(Math.min(innerWidth, innerHeight) / 200));
    const scan = tier >= 4;
    const bits = pxBits();
    let last = 0;
    const rb = k.reels.length ? k.reels[0].getBoundingClientRect() : null;
    const box = rb ? { x: Math.round(rb.left / PX), y: Math.round(rb.top / PX), w: Math.round(rb.width / PX), h: Math.round(rb.height / PX) } : null;
    const marching = (g, t, col, speed) => {
        // marching ants
        if (!box) {
            return;
        }
        g.fillStyle = col;
        const per = 2 * (box.w + box.h);
        const off = Math.floor(t / (speed || 40));
        for (let i = 0; i < per; i++) {
            if ((i + off) % 6 > 2) {
                continue;
            }
            let x;
            let y;
            if (i < box.w) {
                x = box.x + i;
                y = box.y - 2;
            } else if (i < box.w + box.h) {
                x = box.x + box.w + 1;
                y = box.y + i - box.w;
            } else if (i < 2 * box.w + box.h) {
                x = box.x + box.w - (i - box.w - box.h);
                y = box.y + box.h + 1;
            } else {
                x = box.x - 2;
                y = box.y + box.h - (i - 2 * box.w - box.h);
            }
            g.fillRect(x, y, 1, 1);
        }
    };
    // dither vignette, a > 1 blacks out the middle too
    const ditherVeil = (g, a, W, H, col) => {
        a = Math.max(0, a);
        if (a <= 0) {
            return;
        }
        col = col || '#000';
        const M = Math.hypot(W, H) / 2;
        const steps = [[1, 1], [0.62, 0.66], [0.38, 0.33]];
        steps.forEach(([rf, lf], i) => {
            const lv = Math.min(16, Math.round(a * lf * 14));
            if (lv <= 0) {
                return;
            }
            if (i) {
                g.globalCompositeOperation = 'destination-out';
                pxDisc(g, cx, cy, M * rf, '#000');
                g.globalCompositeOperation = 'source-over';
                pxDisc(g, cx, cy, M * rf, ditherFill(g, col, lv));
            } else {
                g.fillStyle = ditherFill(g, col, lv);
                g.fillRect(0, 0, W, H);
            }
        });
        if (a > 1) {
            g.globalAlpha = Math.min(1, a - 1);
            g.fillStyle = col;
            g.fillRect(0, 0, W, H);
            g.globalAlpha = 1;
        }
    };
    const palFlash = (g, a, W, H, col) => {
        const v = fxFlash(fxStep(a, 3));
        if (v > 0) {
            g.globalAlpha = v;
            g.fillStyle = col;
            g.fillRect(0, 0, W, H);
            g.globalAlpha = 1;
        }
    };
    const ringAt = (g, t, at, dur, r1, col, th, stepMs) => {
        const f = fxK(t, at, at + dur);
        if (f <= 0 || f >= 1) {
            return;
        }
        const ff = fxStep(f, Math.max(4, Math.round(dur / (stepMs || 60))));
        pxCircle(g, cx, cy, 2 + ff * r1, col, th || 1);
    };
    const cx = Math.round(k.cx / PX);
    const cy = Math.round(k.cy / PX);
    const once = {};
    const at = (t, ms, key, fn) => {
        if (t >= ms && !once[key]) {
            once[key] = 1;
            fn();
        }
    };
    const hb = T.hb || [];
    let draw;
    if (tier === 1) {
        draw = (g, t) => {
            at(t, 60, 'b', () => bits.burst(cx, cy, 14, pal, 60, { twinkle: 1, size: 2, life: 1.1, drag: 3 }));
            ringAt(g, t, 0, 900, 70, pal[0], 1);
            marching(g, t, pal[0]);
        };
    } else if (tier === 2) {
        draw = (g, t) => {
            at(t, 80, 'b', () => bits.burst(cx, cy, 30, pal, 110, { life: 1.3, size: 2 }));
            at(t, 300, 'c', () => bits.burst(cx, cy, 10, pal, 70, { twinkle: 1, size: 3, life: 1.2, drag: 3 }));
            ringAt(g, t, 0, 1000, 80, pal[0], 2);
            ringAt(g, t, 250, 1100, 110, pal[1], 1);
            marching(g, t, pal[2], 30);
        };
        k.reelGlow(0, 1500, T.c, 1.03);
    } else if (tier === 3) {
        // coins
        draw = (g, t, W, H) => {
            ditherVeil(g, fxEnv(t, 0, 2700, 300, 600) * 0.7, W, H);
            at(t, 120, 'c', () => {
                for (let i = 0; i < 14; i++) {
                    bits.add({ x: cx + (Math.random() - 0.5) * 20, y: cy, vx: (Math.random() - 0.5) * 140, vy: -120 - Math.random() * 120, g: 260, life: 1.8, s: 4, coin: 1, spin: Math.random() * 6 });
                }
            });
            at(t, 150, 'b', () => bits.burst(cx, cy, 40, pal, 150, { life: 1.6, size: 2 }));
            ringAt(g, t, 150, 1200, 120, pal[0], 2);
            ringAt(g, t, 400, 1300, 150, pal[1], 1);
            marching(g, t, pal[0], 30);
        };
        k.dof(0, 2700, 3, 0.5);
    } else if (tier === 4) {
        // power up
        draw = (g, t, W, H) => {
            ditherVeil(g, fxEnv(t, 0, 3300, 200, 900) * 0.75, W, H);
            [0, 180, 360].forEach((ms, i) => palFlash(g, fxEnv(t, ms, ms + 140, 20, 100) * 0.5, W, H, pal[i % 2 ? 1 : 0]));
            const rot = fxStep(fxK(t, 0, 3000), 12) * 1.6;
            const ba = fxEnv(t, 100, 3000, 300, 900);
            if (ba > 0) {
                const L = Math.max(W, H);
                g.globalAlpha = Math.min(0.55, ba);
                for (let i = 0; i < 8; i++) {
                    const a = rot + i * 0.785;
                    g.fillStyle = i % 2 ? pal[1] : pal[0];
                    g.beginPath();
                    g.moveTo(cx, cy);
                    g.lineTo(cx + Math.cos(a - 0.05) * L, cy + Math.sin(a - 0.05) * L);
                    g.lineTo(cx + Math.cos(a + 0.05) * L, cy + Math.sin(a + 0.05) * L);
                    g.fill();
                }
                g.globalAlpha = 1;
            }
            at(t, 0, 'b', () => bits.burst(cx, cy, 70, pal, 220, { life: 1.8, size: 2 }));
            at(t, 260, 'c', () => bits.burst(cx, cy, 16, pal, 90, { twinkle: 1, size: 3, life: 1.6, drag: 2 }));
            ringAt(g, t, 0, 1200, 180, '#fff', 3);
            ringAt(g, t, 140, 1400, 210, pal[0], 2);
            ringAt(g, t, 300, 1600, 240, pal[1], 1);
            marching(g, t, pal[2], 25);
        };
        k.shockPage(40, 32, 0, 1.4);
    } else if (tier === 5) {
        // fireworks
        const rockets = Array.from({ length: 6 }, (_, i) => ({ x: 0.15 + i * 0.14 + (Math.random() - 0.5) * 0.05, at: 150 + i * 330 + Math.random() * 120, top: 0.18 + Math.random() * 0.3, col: RAINBOW8[i % 7] }));
        draw = (g, t, W, H) => {
            ditherVeil(g, fxEnv(t, 0, 4200, 300, 900) * 0.8, W, H, '#1a1c2c');
            rockets.forEach((r, i) => {
                const x = Math.round(r.x * W);
                const y0 = H + 2;
                const y1 = Math.round(r.top * H);
                const f = fxK(t, r.at, r.at + 520);
                if (f > 0 && f < 1) {
                    const y = y0 + (y1 - y0) * (1 - Math.pow(1 - f, 2));
                    g.fillStyle = '#fff';
                    g.fillRect(x, Math.round(y), 1, 2);
                    g.fillStyle = r.col;
                    g.fillRect(x, Math.round(y) + 2, 1, 3);
                }
                at(t, r.at + 520, 'r' + i, () => {
                    bits.burst(x, y1, 28, [r.col, '#fff', r.col], 70, { ring: 1, life: 1.6, size: 1, grav: 30, drag: 1.2 });
                    bits.burst(x, y1, 12, [r.col], 30, { twinkle: 1, size: 2, life: 1.2, drag: 2 });
                });
            });
            at(t, 0, 'b', () => bits.burst(cx, cy, 50, pal, 170, { life: 1.6, size: 2, grav: 60 }));
            ringAt(g, t, 0, 1300, 160, pal[0], 2);
            marching(g, t, pal[0], 25);
        };
        k.bars(0, 4200, 7);
    } else if (tier === 6) {
        // explosion
        draw = (g, t, W, H) => {
            ditherVeil(g, fxEnv(t, 0, 5000, 150, 1200) * 0.8, W, H, '#1a0a06');
            palFlash(g, fxEnv(t, 0, 220, 10, 200) * 0.85, W, H, '#fff');
            const f = fxK(t, 0, 1600);
            if (f > 0 && f < 1) {
                const r = fxStep(Math.pow(f, 0.5), 10) * 70;
                const fade = Math.round((1 - f) * 16);
                pxDisc(g, cx, cy, r, ditherFill(g, '#5f574f', Math.max(1, fade)));
                pxDisc(g, cx, cy, r * 0.8, ditherFill(g, pal[1], Math.max(1, fade)));
                pxDisc(g, cx, cy, r * 0.55, ditherFill(g, pal[0], Math.max(1, fade)));
                pxDisc(g, cx, cy, r * 0.3, ditherFill(g, pal[2], Math.max(1, fade)));
            }
            at(t, 0, 'b', () => {
                bits.burst(cx, cy, 90, pal, 260, { life: 2, size: 2, grav: 140, drag: 1.2 });
                bits.burst(cx, cy, 30, ['#5f574f', '#83769c'], 60, { life: 2.6, size: 3, grav: -20, drag: 1 });
            });
            at(t, 600, 'e', () => bits.burst(cx, cy, 20, [pal[2], '#fff'], 80, { twinkle: 1, size: 2, life: 1.6 }));
            ringAt(g, t, 0, 1400, 260, '#fff', 3);
            ringAt(g, t, 100, 1700, 300, pal[0], 2);
            if (t > 200 && t < 4400) {
                if (Math.random() < 0.5) {
                    bits.add({ x: Math.random() * W, y: H + 1, vx: 0, vy: -30 - Math.random() * 40, life: 2.4, col: pal[Math.random() * 3 | 0] });
                }
            }
            marching(g, t, pal[2], 20);
        };
        retroShake(k, k.game, 0, 1200, 16);
        k.shockPage(30, 44, 0, 1.8);
    } else if (tier === 7) {
        // two strikes, second one inverts
        const seeds = [Math.random() * 99999 | 0, Math.random() * 99999 | 0, Math.random() * 99999 | 0];
        draw = (g, t, W, H) => {
            ditherVeil(g, fxEnv(t, 0, 5800, 100, 1200) * 0.85, W, H, '#0b0820');
            [0, 340].forEach((ms, i) => {
                const a = fxEnv(t, ms, ms + 420, 10, 250);
                if (a > 0 && (a > 0.5 || Math.floor(t / 50) % 2 || calmFx)) {
                    const sx = i ? W * 0.82 : W * 0.18;
                    pxBolt(g, sx, 0, cx, cy, i ? pal[3] : pal[2], seeds[i] + Math.floor(t / 70), 26);
                    pxBolt(g, sx + (i ? -30 : 30), 0, cx, cy, pal[0], seeds[2] + Math.floor(t / 90), 18);
                }
                palFlash(g, fxEnv(t, ms, ms + 200, 10, 180) * 0.7, W, H, i ? pal[3] : '#fff');
            });
            if (t > 340 && t < 900) {
                const y = Math.floor(((t - 340) / 560) * H);
                g.globalCompositeOperation = 'difference';
                g.fillStyle = calmFx ? 'rgba(255,255,255,.25)' : '#fff';
                g.fillRect(0, y - 20, W, 12);
                g.fillRect(0, y - 60, W, 6);
                g.globalCompositeOperation = 'source-over';
            }
            at(t, 0, 'b1', () => bits.burst(cx, cy, 60, pal, 200, { life: 1.6, size: 2, grav: 80 }));
            at(t, 340, 'b2', () => bits.burst(cx, cy, 90, pal, 280, { life: 2, size: 2, grav: 120 }));
            at(t, 500, 'tw', () => bits.burst(cx, cy, 24, [pal[2], pal[3]], 120, { twinkle: 1, size: 3, life: 1.8, drag: 2 }));
            ringAt(g, t, 0, 1100, 200, '#fff', 2);
            ringAt(g, t, 340, 1500, 320, pal[0], 3);
            ringAt(g, t, 500, 1700, 360, pal[3], 1);
            marching(g, t, pal[2], 18);
        };
        retroShake(k, k.game, 0, 380, 12);
        retroShake(k, k.game, 340, 1400, 20);
        k.shockPage(360, 50, 0, 2);
    } else if (tier === 8) {
        // iris wipe on the heartbeat
        draw = (g, t, W, H) => {
            const R0 = Math.hypot(W, H) * 0.6;
            if (t < vd + 120) {
                let n = 0;
                hb.forEach(ms => {
                    if (t >= ms) {
                        n++;
                    }
                });
                const target = R0 * (1 - n / (hb.length + 1) * 0.9);
                const r = t < vd ? target : Math.max(4, target * (1 - fxK(t, vd, vd + 120)));
                g.fillStyle = '#000';
                g.fillRect(0, 0, W, H);
                g.globalCompositeOperation = 'destination-out';
                pxDisc(g, cx, cy, r, '#000');
                g.globalCompositeOperation = 'source-over';
                pxCircle(g, cx, cy, r, pal[0], 1);
                hb.forEach((ms, i) => ringAt(g, t, ms, 300, 30 + i * 6, pal[i % 2 ? 1 : 3], 1));
            } else {
                // open
                const f = fxK(t, vd + 120, vd + 900);
                if (f < 1) {
                    const r = fxStep(f, 8) * R0;
                    g.fillStyle = '#000';
                    g.fillRect(0, 0, W, H);
                    g.globalCompositeOperation = 'destination-out';
                    pxDisc(g, cx, cy, Math.max(1, r), '#000');
                    g.globalCompositeOperation = 'source-over';
                    pxCircle(g, cx, cy, r, '#fff', 2);
                }
                palFlash(g, fxEnv(t, vd + 100, vd + 400, 20, 250) * 0.6, W, H, pal[2]);
                ditherVeil(g, fxEnv(t, vd + 400, vd + 6000, 200, 1200) * 0.6, W, H, '#0b0820');
            }
            at(t, vd + 120, 'b', () => {
                bits.burst(cx, cy, 100, pal, 300, { life: 2.2, size: 2, grav: 60 });
                bits.burst(cx, cy, 30, pal, 160, { twinkle: 1, size: 3, life: 2.4, drag: 1.6 });
            });
            ringAt(g, t, vd + 120, 1500, 300, '#fff', 3);
            ringAt(g, t, vd + 300, 1800, 340, pal[1], 2);
            if (t > vd) {
                marching(g, t, pal[0], 20);
            }
        };
        k.dof(0, vd + 200, 3, 0.4);
        retroShake(k, k.game, vd + 100, 1200, 14);
    } else if (tier === 9) {
        const stars = Array.from({ length: 160 }, () => ({ a: Math.random() * 6.2832, d: Math.random(), v: 0.4 + Math.random() * 0.9, c: Math.random() < 0.2 ? RAINBOW8[Math.random() * 7 | 0] : '#fff' }));
        let blocks = null;
        draw = (g, t, W, H, dt) => {
            const sp = t < vd ? 0.2 + fxK(t, 0, vd) * 1.6 : Math.max(0.15, 1.8 - fxK(t, vd, vd + 3000) * 1.65);
            const vis = fxEnv(t, 0, vd + 6000, 400, 1500);
            if (t < vd + 300) {
                ditherVeil(g, fxK(t, 0, 800) * 1.75, W, H, '#000');
            } else {
                ditherVeil(g, vis * 0.75, W, H, '#000');
            }
            const M = Math.hypot(W, H) * 0.6;
            stars.forEach(s => {
                s.d += s.v * sp * dt;
                if (s.d > 1) {
                    s.d = 0.02;
                    s.a = Math.random() * 6.2832;
                }
                const r = s.d * s.d * M;
                const len = Math.max(1, sp * s.d * 10);
                if (vis > 0) {
                    pxLine(g, cx + Math.cos(s.a) * r, cy + Math.sin(s.a) * r, cx + Math.cos(s.a) * (r + len), cy + Math.sin(s.a) * (r + len), s.c);
                }
            });
            hb.forEach((ms, i) => {
                for (let j = 0; j < 3; j++) {
                    ringAt(g, t, ms + j * 60, 500, 40 + i * 14 + j * 8, RAINBOW8[(i + j) % 7], 1);
                }
            });
            if (t >= vd - 80 && t < vd + 2000) {
                // rainbow blocks, cleared in random order
                if (!blocks) {
                    blocks = [];
                    const S = 12;
                    for (let y = 0; y < H; y += S) {
                        for (let x = 0; x < W; x += S) {
                            blocks.push({ x, y, S, o: Math.random(), c: RAINBOW8[((x + y) / S | 0) % 7] });
                        }
                    }
                }
                const f = fxK(t, vd + 100, vd + 1800);
                blocks.forEach(b => {
                    if (b.o >= f) {
                        const cyc = calmFx ? 0 : Math.floor(t / 220);
                        g.fillStyle = f === 0 ? '#fff' : RAINBOW8[(RAINBOW8.indexOf(b.c) + cyc) % 7];
                        g.globalAlpha = f === 0 ? fxFlash(1) : calmFx ? 0.35 : 1;
                        g.fillRect(b.x, b.y, b.S, b.S);
                        g.globalAlpha = 1;
                    }
                });
            }
            at(t, vd + 900, 'b', () => {
                bits.burst(cx, cy, 120, RAINBOW8, 300, { life: 2.4, size: 2, grav: 40 });
                bits.burst(cx, cy, 30, ['#fff', '#fbf236'], 150, { twinkle: 1, size: 3, life: 2.6, drag: 1.4 });
            });
            if (t > vd + 1200) {
                marching(g, t, RAINBOW8[Math.floor(t / 120) % 7], 16);
            }
        };
        k.dof(0, vd, 3, 0.35);
        retroShake(k, k.game, vd, 1600, 18);
    } else if (tier === 10) {
        // supernova
        draw = (g, t, W, H) => {
            ditherVeil(g, fxEnv(t, 0, vd + 7000, 600, 1500) * 0.85, W, H, '#05041a');
            let pulse = 0;
            hb.forEach(ms => {
                pulse = Math.max(pulse, fxEnv(t, ms, ms + 260, 30, 200));
            });
            if (t < vd) {
                const grow = fxK(t, 0, vd - 300);
                const shrink = fxK(t, vd - 300, vd);
                const r = (6 + grow * 22 + pulse * 6) * (1 - shrink * 0.9);
                pxDisc(g, cx, cy, r + 3, ditherFill(g, pal[1], 8));
                pxDisc(g, cx, cy, r, pal[0]);
                pxDisc(g, cx, cy, r * 0.5, '#fff');
                pxCircle(g, cx, cy, r + 6 + pulse * 4, pal[1], 1);
            }
            palFlash(g, fxEnv(t, vd - 40, vd + 500, 20, 450), W, H, '#fff');
            [0, 140, 280, 420, 560].forEach((ms, i) => ringAt(g, t, vd + ms, 1800 + i * 200, 260 + i * 40, [pal[0], '#fff', pal[1], pal[3], pal[0]][i], 3 - Math.min(2, i)));
            at(t, vd, 'b', () => {
                bits.burst(cx, cy, 160, pal, 340, { life: 2.6, size: 2, drag: 1 });
                bits.burst(cx, cy, 40, pal, 120, { twinkle: 1, size: 3, life: 3, drag: 1.2 });
            });
            at(t, vd + 600, 'c', () => bits.burst(cx, cy, 60, [pal[1], pal[3]], 90, { life: 3.4, size: 1, drag: 0.6 }));
            if (t > vd) {
                marching(g, t, pal[(Math.floor(t / 100) % 2) ? 0 : 3], 14);
            }
        };
        k.rumble(k.game, 0, vd, 5);
        retroShake(k, k.game, vd, 1800, 22);
        k.shockPage(vd + 40, 110, 0, 2.8);
    } else if (tier === 11) {
        const motes = Array.from({ length: 220 }, () => ({ a: Math.random() * 6.2832, r: 0.3 + Math.random() * 0.7, c: pal[Math.random() * 4 | 0] }));
        draw = (g, t, W, H) => {
            const M = Math.hypot(W, H) * 0.55;
            if (t < vd + 80) {
                ditherVeil(g, fxK(t, 0, vd * 0.8) * 1.05, W, H, '#000');
                const f = fxK(t, 0, vd);
                motes.forEach(m => {
                    m.a += 0.03 + 0.05 / m.r;
                    m.r = Math.max(0.02, m.r - 0.0015 - f * 0.004);
                    const r = m.r * M;
                    g.fillStyle = m.c;
                    g.fillRect(Math.round(cx + Math.cos(m.a) * r), Math.round(cy + Math.sin(m.a) * r * 0.75), 1, 1);
                });
                const R = 10 + f * 14;
                const rot = fxStep(t / 1000, 8);
                for (let i = 0; i < 48; i++) {
                    const a = i / 48 * 6.2832 + rot;
                    const rr = R * (1.6 + (i % 3) * 0.25);
                    g.fillStyle = i % 4 ? pal[0] : pal[2];
                    g.fillRect(Math.round(cx + Math.cos(a) * rr), Math.round(cy + Math.sin(a) * rr * 0.4), 2, 1);
                }
                pxDisc(g, cx, cy, R, '#000');
                pxCircle(g, cx, cy, R, pal[1], 1);
                hb.forEach((ms, i) => {
                    const ff = fxK(t, ms, ms + 500);
                    if (ff > 0 && ff < 1) {
                        pxCircle(g, cx, cy, R + (1 - fxStep(ff, 6)) * 60, pal[i % 2 ? 1 : 2], 1);
                    }
                });
            } else {
                palFlash(g, fxEnv(t, vd, vd + 900, 30, 800), W, H, '#fff');
                ditherVeil(g, fxEnv(t, vd + 300, vd + 8000, 400, 1500) * 0.7, W, H, '#05041a');
            }
            at(t, vd + 40, 'b', () => {
                bits.burst(cx, cy, 200, RAINBOW8, 380, { life: 2.8, size: 2, drag: 1 });
                bits.burst(cx, cy, 50, ['#fff', pal[2]], 160, { twinkle: 1, size: 3, life: 3, drag: 1.2 });
            });
            [0, 160, 320, 480, 640].forEach((ms, i) => ringAt(g, t, vd + ms, 2000 + i * 200, 280 + i * 40, ['#fff', pal[0], pal[2], pal[1], '#fff'][i], 3 - Math.min(2, i)));
            if (t > vd + 200) {
                marching(g, t, RAINBOW8[Math.floor(t / 90) % 7], 12);
            }
        };
        k.dof(0, vd, 5, 0.25);
        k.rumble(k.game, 0, vd, 6);
        retroShake(k, k.game, vd, 1900, 24);
    } else {
        const rockets = Array.from({ length: 12 }, (_, i) => ({ x: 0.06 + i * 0.08 + Math.random() * 0.03, at: vd + 1400 + i * 260 + Math.random() * 150, top: 0.12 + Math.random() * 0.35, col: RAINBOW8[i % 7] }));
        const crt = vd + 7600;
        draw = (g, t, W, H) => {
            if (t < vd) {
                g.fillStyle = '#000';
                g.globalAlpha = fxK(t, 0, 1400);
                g.fillRect(0, 0, W, H);
                g.globalAlpha = 1;
                hb.forEach((ms, i) => {
                    const a = fxEnv(t, ms, ms + 400, 20, 300);
                    if (a > 0) {
                        const s = 1 + Math.floor(i / 2);
                        g.fillStyle = i % 2 ? pal[1] : '#fff';
                        g.fillRect(cx - (s >> 1), cy - (s >> 1), s, s);
                        pxCircle(g, cx, cy, 3 + i * 2 + (1 - a) * 6, pal[i % pal.length], 1);
                    }
                });
            } else if (t < vd + 2000) {
                // blast
                const f = fxK(t, vd, vd + 1600);
                const R = fxStep(Math.pow(f, 0.6), 16) * Math.hypot(W, H) * 0.6;
                g.fillStyle = '#000';
                g.globalAlpha = 1 - f;
                g.fillRect(0, 0, W, H);
                g.globalAlpha = calmFx ? 0.35 : 1 - f * 0.7;
                for (let i = 0; i < 7; i++) {
                    const r = R - i * 6;
                    if (r > 1) {
                        pxDisc(g, cx, cy, r, RAINBOW8[(i + (calmFx ? 0 : Math.floor(t / 140))) % 7]);
                    }
                }
                pxDisc(g, cx, cy, Math.max(1, R - 48), '#fff');
                g.globalAlpha = 1;
            } else {
                ditherVeil(g, fxEnv(t, vd + 2000, crt, 300, 600) * 0.7, W, H, '#0b0820');
            }
            rockets.forEach((r, i) => {
                const x = Math.round(r.x * W);
                const y1 = Math.round(r.top * H);
                const f = fxK(t, r.at, r.at + 480);
                if (f > 0 && f < 1) {
                    const y = H + (y1 - H) * (1 - Math.pow(1 - f, 2));
                    g.fillStyle = '#fff';
                    g.fillRect(x, Math.round(y), 1, 3);
                }
                at(t, r.at + 480, 'r' + i, () => bits.burst(x, y1, 32, [r.col, '#fff'], 80, { ring: 1, life: 1.8, size: 1, grav: 30, drag: 1.1 }));
            });
            at(t, vd + 200, 'b', () => {
                bits.burst(cx, cy, 240, RAINBOW8, 420, { life: 3, size: 2, drag: 0.9 });
                bits.burst(cx, cy, 60, ['#fff', '#ffec27'], 200, { twinkle: 1, size: 3, life: 3.4, drag: 1.1 });
            });
            if (t > vd + 1500 && t < crt) {
                marching(g, t, RAINBOW8[Math.floor(t / 90) % 7], 12);
            }
            // crt switching on
            if (t >= crt) {
                const f = fxK(t, crt, crt + 900);
                const hh = Math.round(fxStep(Math.pow(f, 0.7), 12) * H / 2);
                g.fillStyle = '#000';
                g.globalAlpha = calmFx ? 0.5 * (1 - f) : 1 - fxK(t, crt + 700, crt + 1300);
                g.fillRect(0, 0, W, Math.max(0, H / 2 - hh - 1));
                g.fillRect(0, H / 2 + hh + 1, W, H);
                g.globalAlpha = fxFlash(1 - f);
                g.fillStyle = '#fff';
                g.fillRect(0, Math.round(H / 2 - hh - 1), W, 1);
                g.fillRect(0, Math.round(H / 2 + hh), W, 1);
                g.globalAlpha = 1;
            }
        };
        retroShake(k, k.game, vd + 100, 2200, 26);
        k.shockPage(vd + 120, 120, 0, 3);
    }
    fxScene(k, total, (g, t, W, H) => {
        const dt = Math.min(0.05, (t - last) / 1000);
        last = t;
        draw(g, t, W, H, dt);
        bits.draw(g, dt);
    }, { px: PX, scan });
}

// astral
const ASTRAL_GOLD = '#ffd98a';
// random constellation around x, y
function astralFigure(x, y, R, n, seed) {
    seed = seed || (Math.random() * 1e9 | 0) + 1;
    const r = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
    const pts = [];
    let a = r() * 6.28;
    let px = x + Math.cos(a) * R * 0.6;
    let py = y + Math.sin(a) * R * 0.6;
    for (let i = 0; i < n; i++) {
        pts.push({ x: px, y: py, s: 0.6 + r() * 0.9 });
        a += (r() - 0.5) * 2.2;
        const d = R * (0.35 + r() * 0.35);
        px = Math.max(x - R, Math.min(x + R, px + Math.cos(a) * d));
        py = Math.max(y - R, Math.min(y + R, py + Math.sin(a) * d));
    }
    const edges = pts.slice(1).map((_, i) => [i, i + 1]);
    if (n > 4) {
        edges.push([1 + (r() * (n - 3) | 0), n - 1]);
    }
    return { pts, edges };
}
// f = how far it's drawn in
function astralDraw(g, C, f, a, col) {
    if (f <= 0 || a <= 0) {
        return;
    }
    const n = C.pts.length;
    g.lineWidth = 1;
    g.strokeStyle = col || ASTRAL_GOLD;
    C.edges.forEach(([i, j], e) => {
        const k = Math.max(0, Math.min(1, f * (C.edges.length + 1) - e));
        if (k <= 0) {
            return;
        }
        const A = C.pts[i];
        const B = C.pts[j];
        g.globalAlpha = a * 0.55;
        g.beginPath();
        g.moveTo(A.x, A.y);
        g.lineTo(A.x + (B.x - A.x) * k, A.y + (B.y - A.y) * k);
        g.stroke();
    });
    C.pts.forEach((p, i) => {
        const k = Math.max(0, Math.min(1, f * (n + 1) - i));
        if (k > 0) {
            astralStar(g, p.x, p.y, 2.2 * p.s * (0.6 + 0.4 * k), '#fff', a * k, i % 3 === 0);
        }
    });
    g.globalAlpha = 1;
}
function astralStar(g, x, y, r, col, a, spike) {
    if (a <= 0) {
        return;
    }
    const d = r * 7;
    g.globalAlpha = Math.min(1, a);
    g.drawImage(fxSprite(col), x - d / 2, y - d / 2, d, d);
    if (spike) {
        g.strokeStyle = col;
        g.lineWidth = 0.8;
        g.globalAlpha = Math.min(1, a) * 0.6;
        g.beginPath();
        g.moveTo(x - r * 5, y);
        g.lineTo(x + r * 5, y);
        g.moveTo(x, y - r * 5);
        g.lineTo(x, y + r * 5);
        g.stroke();
    }
    g.globalAlpha = 1;
}
function astralComet(g, x, y, ang, len, col, a, w) {
    const tx = x - Math.cos(ang) * len;
    const ty = y - Math.sin(ang) * len;
    const gr = g.createLinearGradient(x, y, tx, ty);
    gr.addColorStop(0, col);
    gr.addColorStop(1, 'rgba(255,255,255,0)');
    g.globalAlpha = a;
    g.strokeStyle = gr;
    g.lineWidth = w || 2;
    g.lineCap = 'round';
    g.beginPath();
    g.moveTo(x, y);
    g.lineTo(tx, ty);
    g.stroke();
    astralStar(g, x, y, (w || 2) * 1.2, col, a);
}
function astralNight(g, cx, cy, W, H, a, inner) {
    if (a <= 0) {
        return;
    }
    const gr = g.createRadialGradient(cx, cy, 0, cx, cy, Math.hypot(W, H) * 0.7);
    const i0 = inner == null ? 1 : inner;
    gr.addColorStop(0, 'rgba(6,10,34,' + (0.35 + 0.3 * i0) + ')');
    gr.addColorStop(0.3, 'rgba(5,8,30,.9)');
    gr.addColorStop(1, 'rgba(2,3,14,.97)');
    g.globalAlpha = Math.min(1, a);
    g.fillStyle = gr;
    g.fillRect(0, 0, W, H);
    g.globalAlpha = 1;
}
function astralGlow(g, x, y, r, col, a) {
    if (a <= 0 || r <= 0) {
        return;
    }
    const gr = g.createRadialGradient(x, y, 0, x, y, r);
    gr.addColorStop(0, col);
    gr.addColorStop(1, 'rgba(0,0,0,0)');
    g.globalAlpha = Math.min(1, a);
    g.globalCompositeOperation = 'lighter';
    g.fillStyle = gr;
    g.fillRect(x - r, y - r, r * 2, r * 2);
    g.globalCompositeOperation = 'source-over';
    g.globalAlpha = 1;
}
function astralFx(tier, k) {
    const { T, vd, total, cx, cy } = k;
    const c = T.c;
    const c2 = T.c2;
    const hb = T.hb || [];
    const W0 = innerWidth;
    const H0 = innerHeight;
    const M = Math.hypot(W0, H0);
    // background stars
    const field = Array.from({ length: 70 + tier * 20 }, () => ({ x: Math.random() * W0, y: Math.random() * H0, s: 0.4 + Math.random() * 1.2, tw: Math.random() * 6.28, c: Math.random() < 0.15 ? c : Math.random() < 0.2 ? ASTRAL_GOLD : '#fff' }));
    const sky = (g, t, a) => field.forEach(s => astralStar(g, s.x, s.y, s.s, s.c, a * (0.55 + 0.45 * Math.sin(s.tw + t / 400))));
    const halo = (g, t, at, dur, r1, col, w) => {
        const f = fxK(t, at, at + dur);
        if (f <= 0 || f >= 1) {
            return;
        }
        g.globalAlpha = (1 - f) * 0.8;
        g.strokeStyle = col;
        g.lineWidth = (w || 1.5) * (1 - f * 0.6);
        g.beginPath();
        g.arc(cx, cy, 8 + Math.pow(f, 0.6) * r1, 0, 6.2832);
        g.stroke();
        g.globalAlpha = 1;
    };
    let draw;
    if (tier === 1) {
        const C = astralFigure(cx + 120, cy - 30, 70, 5);
        draw = (g, t, W, H) => {
            astralNight(g, cx, cy, W, H, fxEnv(t, 0, 1700, 300, 600) * 0.55);
            astralDraw(g, C, fxK(t, 0, 900), fxEnv(t, 0, 1700, 100, 500));
            halo(g, t, 0, 1200, 160, ASTRAL_GOLD, 1);
        };
        k.sweep(0, 1100, c);
    } else if (tier === 2) {
        // two constellations and a shooting star
        const C1 = astralFigure(cx - 160, cy - 20, 80, 6);
        const C2 = astralFigure(cx + 160, cy + 10, 80, 5);
        draw = (g, t, W) => {
            const a = fxEnv(t, 0, 2200, 100, 600);
            astralNight(g, cx, cy, W, innerHeight, fxEnv(t, 0, 2200, 300, 700) * 0.7);
            astralDraw(g, C1, fxK(t, 0, 1100), a);
            astralDraw(g, C2, fxK(t, 250, 1300), a);
            const f = fxK(t, 200, 900);
            if (f > 0 && f < 1) {
                astralComet(g, -40 + f * (W + 80), cy - 220 + f * 120, 0.12, 140, '#fff', 1 - f * 0.5, 2);
            }
            halo(g, t, 100, 1400, 220, c, 1.2);
        };
        k.reelGlow(0, 1500, c, 1.03);
    } else if (tier === 3) {
        // ring of constellations
        const figs = Array.from({ length: 6 }, (_, i) => astralFigure(cx + Math.cos(i * 1.047) * 230, cy + Math.sin(i * 1.047) * 160, 70, 5));
        draw = (g, t, W, H) => {
            const a = fxEnv(t, 0, 2900, 400, 800);
            astralNight(g, cx, cy, W, H, a * 0.85);
            sky(g, t, a);
            figs.forEach((C, i) => astralDraw(g, C, fxK(t, 200 + i * 140, 1100 + i * 140), a));
            halo(g, t, 150, 1600, 260, ASTRAL_GOLD, 1.5);
        };
        k.dof(0, 2700, 3, 0.5);
        k.particles([{ type: 'burst', at: 150, n: 60, cols: ['#fff', ASTRAL_GOLD, c], speed: 300, life: 1.8, size: 1.6, drag: 1.4 }]);
    } else if (tier === 4) {
        // orbiting planet
        draw = (g, t, W, H) => {
            const a = fxEnv(t, 0, 3400, 300, 800);
            astralNight(g, cx, cy, W, H, a * 0.85);
            sky(g, t, a);
            const rx = Math.min(W * 0.42, 420);
            const ry = rx * 0.32;
            g.globalAlpha = a * 0.45;
            g.strokeStyle = ASTRAL_GOLD;
            g.lineWidth = 1;
            g.beginPath();
            g.ellipse(cx, cy, rx, ry, -0.18, 0, 6.2832);
            g.stroke();
            const ang = -1.2 + fxK(t, 0, 3200) * 6.28 * 1.15;
            const px = cx + Math.cos(ang) * rx * Math.cos(-0.18) - Math.sin(ang) * ry * Math.sin(-0.18);
            const py = cy + Math.cos(ang) * rx * Math.sin(-0.18) + Math.sin(ang) * ry * Math.cos(-0.18);
            const pr = 12 + 4 * Math.sin(ang);
            const front = Math.sin(ang) > 0;
            if (front || fxK(t, 0, 3200) < 1) {
                const gr = g.createRadialGradient(px - pr * 0.4, py - pr * 0.4, 1, px, py, pr);
                gr.addColorStop(0, '#fff');
                gr.addColorStop(0.3, c);
                gr.addColorStop(1, c2);
                g.globalAlpha = a;
                g.fillStyle = gr;
                g.beginPath();
                g.arc(px, py, pr, 0, 6.2832);
                g.fill();
                astralGlow(g, px, py, pr * 3, c, a * 0.5);
            }
            halo(g, t, 0, 1500, 300, '#fff', 2);
            halo(g, t, 200, 1800, 360, c, 1.2);
        };
        k.shockPage(40, 30, 1, 1.4);
        k.particles([{ type: 'burst', at: 0, n: 110, cols: ['#fff', ASTRAL_GOLD, c, c2], speed: 520, life: 2, size: 1.8, trail: 1 }]);
    } else if (tier === 5) {
        // meteor shower
        const meteors = Array.from({ length: 34 }, (_, i) => ({ at: 150 + i * 105 + Math.random() * 80, x: Math.random() * 1.3 - 0.1, y: -0.1 - Math.random() * 0.2, sp: 0.9 + Math.random() * 0.8, len: 80 + Math.random() * 160, col: i % 4 ? '#fff' : i % 8 ? ASTRAL_GOLD : c }));
        draw = (g, t, W, H) => {
            const a = fxEnv(t, 0, 4200, 400, 900);
            astralNight(g, cx, cy, W, H, a * 0.9);
            sky(g, t, a);
            meteors.forEach(m => {
                const f = fxK(t, m.at, m.at + 900 / m.sp);
                if (f > 0 && f < 1) {
                    const x = (m.x - f * 0.5) * W;
                    const y = (m.y + f * 0.9) * H;
                    astralComet(g, x, y, 2.07, m.len, m.col, a * Math.sin(Math.PI * f), 1.6);
                }
            });
            halo(g, t, 0, 1800, 320, ASTRAL_GOLD, 2);
        };
        k.P(k.app, [{ transform: 'none' }, { transform: 'perspective(1100px) rotateX(8deg) scale(.95)', offset: 0.28 }, { transform: 'perspective(1100px) rotateX(6deg) scale(.955)', offset: 0.6 }, { transform: 'none' }], { duration: 4000, easing: 'cubic-bezier(.3,.1,.2,1)' });
        if (k.app) {
            k.app.style.transformOrigin = '50% ' + (cy - k.app.getBoundingClientRect().top) + 'px';
        }
        k.bars(0, 4200, 7);
        k.particles([{ type: 'burst', at: 0, n: 120, cols: ['#fff', ASTRAL_GOLD, c], speed: 520, life: 2, size: 2, trail: 1, grav: 30 }]);
    } else if (tier === 6) {
        // solar flare
        const loops = Array.from({ length: 7 }, (_, i) => ({ a: i * 0.9 + Math.random() * 0.5, h: 0.6 + Math.random() * 0.8, at: 100 + i * 220 }));
        draw = (g, t, W, H) => {
            const a = fxEnv(t, 0, 5000, 200, 1200);
            astralNight(g, cx, cy, W, H, a * 0.9, 0.6);
            sky(g, t, a * 0.7);
            const R = Math.min(W, H) * 0.09;
            const sun = a * (1 - fxK(t, 1600, 2600) * 0.85);
            astralGlow(g, cx, cy, R * 6, c2, a * 0.6);
            astralGlow(g, cx, cy, R * 3, c, sun * 0.9);
            // corona
            g.save();
            g.translate(cx, cy);
            g.rotate(t / 4000);
            g.globalCompositeOperation = 'lighter';
            for (let i = 0; i < 24; i++) {
                const L = R * (2.2 + Math.sin(i * 2.7 + t / 500) * 0.6);
                g.globalAlpha = a * 0.25;
                g.strokeStyle = i % 2 ? c : '#ffe6b0';
                g.lineWidth = 2;
                g.beginPath();
                g.moveTo(Math.cos(i * 0.2618) * R, Math.sin(i * 0.2618) * R);
                g.lineTo(Math.cos(i * 0.2618 + 0.05) * L, Math.sin(i * 0.2618 + 0.05) * L);
                g.stroke();
            }
            g.restore();
            loops.forEach(l => {
                const f = fxK(t, l.at, l.at + 1600);
                if (f <= 0 || f >= 1) {
                    return;
                }
                const a0 = l.a;
                const a1 = l.a + 0.5;
                const x0 = cx + Math.cos(a0) * R;
                const y0 = cy + Math.sin(a0) * R;
                const x1 = cx + Math.cos(a1) * R;
                const y1 = cy + Math.sin(a1) * R;
                const am = (a0 + a1) / 2;
                const hx = cx + Math.cos(am) * R * (1 + l.h * 2.4 * Math.sin(Math.PI * Math.min(1, f * 1.4)));
                const hy = cy + Math.sin(am) * R * (1 + l.h * 2.4 * Math.sin(Math.PI * Math.min(1, f * 1.4)));
                g.globalAlpha = a * (1 - f) * 0.9;
                g.strokeStyle = '#ffb35a';
                g.lineWidth = 3;
                g.globalCompositeOperation = 'lighter';
                g.beginPath();
                g.moveTo(x0, y0);
                g.quadraticCurveTo(hx, hy, x1, y1);
                g.stroke();
                g.globalCompositeOperation = 'source-over';
            });
            g.globalAlpha = sun;
            const gr = g.createRadialGradient(cx, cy, 0, cx, cy, R);
            gr.addColorStop(0, '#fff');
            gr.addColorStop(0.6, '#ffe6b0');
            gr.addColorStop(1, c);
            g.fillStyle = gr;
            g.beginPath();
            g.arc(cx, cy, R, 0, 6.2832);
            g.fill();
            g.globalAlpha = 1;
            halo(g, t, 0, 1600, 360, '#fff', 3);
            halo(g, t, 120, 2000, 420, c, 2);
        };
        k.flash(0, 1100, '#fff', 0.7, 60);
        k.shake(k.game, 0, 1200, 14, 0.5);
        k.shockPage(30, 44, 2, 1.8);
        k.particles([
            { type: 'burst', at: 0, n: 180, cols: [c, c2, '#fff', '#ffe6b0'], speed: 720, life: 2.2, size: 2.2, trail: 1, grav: 60, drag: 1.8 },
            { type: 'embers', at: 200, until: 4400, rate: 40, cols: [c, '#ffe6b0'], life: 2.4, size: 2, wide: 1 }
        ]);
    } else if (tier === 7) {
        // comets
        draw = (g, t, W, H) => {
            const a = fxEnv(t, -600, 5800, 1, 1200);
            astralNight(g, cx, cy, W, H, Math.max(a, 0) * 0.92, 0.5);
            sky(g, t, a);
            [[0, -1], [340, 1]].forEach(([ms, side], i) => {
                const f = ms ? fxK(t, 0, ms) : 0;
                if (f > 0 && f < 1) {
                    const sx = side < 0 ? -60 : W + 60;
                    const sy = i ? H * 0.15 : H * 0.85;
                    const x = sx + (cx - sx) * Math.pow(f, 1.5);
                    const y = sy + (cy - sy) * Math.pow(f, 1.5);
                    astralComet(g, x, y, Math.atan2(cy - sy, cx - sx), 260, i ? c : '#bfe6ff', 1, 3);
                }
                halo(g, t, ms, 1300, 380, i ? c : '#fff', 3);
                halo(g, t, ms + 120, 1700, 460, i ? c2 : '#bfe6ff', 1.5);
            });
            const C = draw.C || (draw.C = astralFigure(cx, cy, Math.min(W, H) * 0.4, 9));
            astralDraw(g, C, fxK(t, 900, 2600), fxEnv(t, 900, 5600, 300, 1200));
        };
        k.flash(0, 900, '#fff', 0.6, 50);
        k.flash(340, 1600, c, 0.6, 70);
        k.shake(k.game, 0, 380, 12, 0.5);
        k.shake(k.game, 340, 1400, 20, 0.8);
        k.shockPage(360, 52, 2.5, 2);
        k.particles([
            { type: 'burst', at: 0, n: 90, cols: ['#fff', '#bfe6ff'], speed: 520, life: 1.6, size: 2, trail: 1 },
            { type: 'burst', at: 340, n: 200, cols: [c, c2, '#fff', ASTRAL_GOLD], speed: 820, life: 2.4, size: 2.3, trail: 1, drag: 1.6 },
            { type: 'stars', at: 600, n: 80, cols: ['#fff', ASTRAL_GOLD], life: 4.6, size: 1.4, pull: -20, rot: 0.05 }
        ]);
    } else if (tier === 8) {
        // eclipse, one step per beat
        draw = (g, t, W, H) => {
            const a = Math.min(1, fxK(t, 0, 600)) * (t > vd ? fxEnv(t, vd, vd + 5800, 1, 1500) : 1);
            astralNight(g, cx, cy, W, H, a * 0.95, 0.4);
            sky(g, t, a * fxK(t, vd - 1200, vd + 200));
            const R = Math.min(W, H) * 0.1;
            let n = 0;
            hb.forEach(ms => {
                if (t >= ms) {
                    n++;
                }
            });
            const cover = t < vd ? n / (hb.length + 1) : 1;
            const off = (1 - cover) * R * 2.1;
            astralGlow(g, cx, cy, R * (t > vd ? 5 : 2.2), t > vd ? '#cfe0ff' : '#ffe6b0', a * (t > vd ? 0.8 * (1 - fxK(t, vd + 1200, vd + 2400) * 0.75) : 0.9));
            if (t > vd) {
                // corona
                g.save();
                g.translate(cx, cy);
                g.globalCompositeOperation = 'lighter';
                for (let i = 0; i < 40; i++) {
                    const L = R * (1.8 + ((i * 37) % 11) / 8);
                    g.globalAlpha = a * 0.22;
                    g.strokeStyle = '#e8f0ff';
                    g.lineWidth = 1.5;
                    g.beginPath();
                    g.moveTo(Math.cos(i * 0.157) * R, Math.sin(i * 0.157) * R);
                    g.lineTo(Math.cos(i * 0.157) * L, Math.sin(i * 0.157) * L);
                    g.stroke();
                }
                g.restore();
            }
            // fade them out so the result shows
            g.globalAlpha = a * (1 - fxK(t, vd + 1200, vd + 2200));
            g.fillStyle = '#fff4d6';
            g.beginPath();
            g.arc(cx, cy, R, 0, 6.2832);
            g.fill();
            g.fillStyle = '#05060f';
            g.beginPath();
            g.arc(cx + off, cy - off * 0.25, R * 1.02, 0, 6.2832);
            g.fill();
            g.globalAlpha = 1;
            // diamond ring
            const dr = fxEnv(t, vd - 120, vd + 700, 80, 500);
            if (dr > 0) {
                astralStar(g, cx - R * 0.72, cy - R * 0.7, 6, '#fff', dr, true);
                astralGlow(g, cx - R * 0.72, cy - R * 0.7, R * 2.5, '#ffffff', dr * 0.8);
            }
            hb.forEach(ms => halo(g, t, ms, 600, R * 2, '#ffe6b0', 1));
            halo(g, t, vd, 1600, 380, '#fff', 3);
            halo(g, t, vd + 200, 2000, 440, c, 1.5);
        };
        k.dof(0, vd + 400, 3, 0.4);
        k.particles([
            { type: 'burst', at: vd, n: 160, cols: ['#fff', '#cfe0ff', c], speed: 640, life: 2.4, size: 2, trail: 1 },
            { type: 'stars', at: vd + 300, n: 90, cols: ['#fff', ASTRAL_GOLD], life: 5, size: 1.4, pull: -24, rot: 0.06 }
        ], total);
    } else if (tier === 9) {
        // star trails + zodiac wheel, then dawn
        const trails = Array.from({ length: 160 }, () => ({ r: 30 + Math.random() * M * 0.6, a: Math.random() * 6.28, s: 0.5 + Math.random(), c: Math.random() < 0.2 ? ASTRAL_GOLD : Math.random() < 0.2 ? c2 : '#fff' }));
        const zod = Array.from({ length: 12 }, (_, i) => astralFigure(0, 0, 26, 4, 1000 + i * 77));
        draw = (g, t, W, H) => {
            const a = Math.min(1, fxK(t, 0, 700)) * (t > vd ? fxEnv(t, vd, vd + 7600, 1, 1800) : 1);
            astralNight(g, cx, cy, W, H, a * 0.95, 0.4);
            const span = Math.min(1.6, fxK(t, 200, vd) * 1.6) * (t > vd ? 1 - fxK(t, vd, vd + 1600) : 1);
            g.lineCap = 'round';
            trails.forEach(s => {
                const a0 = s.a + t / 3000;
                g.globalAlpha = a * 0.5;
                g.strokeStyle = s.c;
                g.lineWidth = s.s;
                g.beginPath();
                g.arc(cx, cy, s.r, a0, a0 + Math.max(0.01, span * s.s * 0.6));
                g.stroke();
            });
            g.globalAlpha = 1;
            const zr = Math.min(W, H) * 0.32;
            const za = fxEnv(t, 300, vd + 6000, 800, 1500) * a;
            if (za > 0) {
                const rot = -0.8 + fxK(t, 300, vd) * 0.8;
                g.globalAlpha = za * 0.5;
                g.strokeStyle = ASTRAL_GOLD;
                g.lineWidth = 1;
                [zr * 0.78, zr * 1.22].forEach(r => {
                    g.beginPath();
                    g.arc(cx, cy, r, 0, 6.2832);
                    g.stroke();
                });
                for (let i = 0; i < 12; i++) {
                    const an = rot + i * 0.5236;
                    g.globalAlpha = za * 0.5;
                    g.beginPath();
                    g.moveTo(cx + Math.cos(an) * zr * 0.78, cy + Math.sin(an) * zr * 0.78);
                    g.lineTo(cx + Math.cos(an) * zr * 1.22, cy + Math.sin(an) * zr * 1.22);
                    g.stroke();
                    const zc = zod[i];
                    const mx = cx + Math.cos(an + 0.26) * zr;
                    const my = cy + Math.sin(an + 0.26) * zr;
                    const moved = { pts: zc.pts.map(p => ({ x: mx + p.x, y: my + p.y, s: p.s * 0.7 })), edges: zc.edges };
                    let lit = 0;
                    hb.forEach(ms => {
                        if (t >= ms) {
                            lit++;
                        }
                    });
                    const on = t > vd || i < lit * 12 / hb.length;
                    astralDraw(g, moved, on ? 1 : 0.25, za * (on ? 1 : 0.5));
                }
            }
            // dawn
            const dawn = fxEnv(t, vd - 100, vd + 3000, 150, 2400);
            if (dawn > 0) {
                const gr = g.createLinearGradient(0, H, 0, 0);
                gr.addColorStop(0, 'rgba(255,190,120,' + fxFlash(dawn) * 0.8 + ')');
                gr.addColorStop(0.5, 'rgba(255,140,170,' + fxFlash(dawn) * 0.35 + ')');
                gr.addColorStop(1, 'rgba(255,140,170,0)');
                g.fillStyle = gr;
                g.fillRect(0, 0, W, H);
            }
            hb.forEach(ms => halo(g, t, ms, 700, 120, ASTRAL_GOLD, 1));
            halo(g, t, vd, 1800, 420, '#fff', 3);
        };
        k.dof(0, vd, 3, 0.35);
        k.flash(vd - 60, 1600, '#fff', 0.8, 90);
        k.shockPage(vd + 40, 60, 2, 2);
        k.particles([
            { type: 'galaxy', at: vd, n: 220, cols: ['#fff', ASTRAL_GOLD, c, c2], speed: 1000, life: 3, size: 2.2, trail: 1, drag: 1.2, spin: 0.8 },
            { type: 'embers', at: vd + 500, until: vd + 7000, rate: 24, cols: ['#fff', ASTRAL_GOLD], life: 3, size: 1.6, wide: 1 }
        ], total);
    } else if (tier === 10) {
        // nebula, then a pulsar
        const clouds = Array.from({ length: 9 }, (_, i) => ({ x: (Math.random() - 0.5) * 0.7, y: (Math.random() - 0.5) * 0.5, r: 0.18 + Math.random() * 0.2, c: [c, c2, '#ff7ad9', '#5a7bff'][i % 4], d: Math.random() * 6.28 }));
        draw = (g, t, W, H) => {
            const a = Math.min(1, fxK(t, 0, 800)) * (t > vd ? fxEnv(t, vd, vd + 8000, 1, 2000) : 1);
            astralNight(g, cx, cy, W, H, a * 0.95, 0.3);
            sky(g, t, a);
            clouds.forEach(cl => {
                const grow = 0.4 + fxK(t, 0, vd) * 0.6 + (t > vd ? fxK(t, vd, vd + 3000) * 0.5 : 0);
                const x = cx + cl.x * W + Math.cos(cl.d + t / 3000) * 20;
                const y = cy + cl.y * H + Math.sin(cl.d + t / 3000) * 14;
                astralGlow(g, x, y, cl.r * Math.min(W, H) * grow * 1.6, cl.c, a * 0.32 * (1 - fxK(t, vd + 800, vd + 2600) * 0.6));
            });
            let pulse = 0;
            hb.forEach(ms => {
                pulse = Math.max(pulse, fxEnv(t, ms, ms + 400, 40, 340));
            });
            if (t < vd) {
                astralGlow(g, cx, cy, 30 + pulse * 40 + fxK(t, 0, vd) * 30, '#fff', a * (0.4 + pulse * 0.6));
                hb.forEach(ms => halo(g, t, ms, 800, 140, c, 1));
            } else {
                const ang = (t - vd) / 900;
                const bl = fxEnv(t, vd, vd + 7000, 200, 1600) * a;
                g.save();
                g.translate(cx, cy);
                g.globalCompositeOperation = 'lighter';
                [0, Math.PI].forEach(o => {
                    g.rotate(o);
                    const gr = g.createLinearGradient(0, 0, M * 0.6, 0);
                    gr.addColorStop(0, 'rgba(255,255,255,' + 0.5 * bl + ')');
                    gr.addColorStop(1, 'rgba(255,255,255,0)');
                    g.fillStyle = gr;
                    g.save();
                    g.rotate(ang);
                    g.beginPath();
                    g.moveTo(0, 0);
                    g.lineTo(M * 0.6, -24);
                    g.lineTo(M * 0.6, 24);
                    g.fill();
                    g.restore();
                });
                g.restore();
                const core = bl * (1 - fxK(t, vd + 1200, vd + 2400) * 0.7);
                astralGlow(g, cx, cy, 90, '#fff', core);
                astralStar(g, cx, cy, 6, '#fff', core, true);
            }
            [0, 150, 300].forEach((ms, i) => halo(g, t, vd + ms, 2000 + i * 300, 460 + i * 60, [ '#fff', c, c2][i], 3 - i));
        };
        k.rumble(k.game, 0, vd, 5);
        k.flash(vd - 60, 1800, '#fff', 0.9, 90);
        k.shake(k.game, vd, 1800, 20, 1);
        k.shockPage(vd + 40, 110, 5, 2.8);
        k.particles([
            { type: 'spiral', at: 400, until: vd, rate: 70, ramp: 1, cols: ['#fff', c, c2], life: 1.3, size: 1.8, dir: -1 },
            { type: 'galaxy', at: vd, n: 260, cols: [c, c2, '#fff', '#ff7ad9'], speed: 1200, life: 3.2, size: 2.4, trail: 1, drag: 1.2, spin: 0.6 },
            { type: 'embers', at: vd + 700, until: vd + 7000, rate: 26, cols: [c, c2, '#fff'], life: 2.8, size: 1.8, wide: 1 }
        ], total);
    } else if (tier === 11) {
        // galaxy, jets on the hit
        const stars = Array.from({ length: 700 }, (_, i) => {
            const arm = i % 3;
            const d = Math.pow(Math.random(), 0.7);
            return { arm, d, j: (Math.random() - 0.5) * 0.5, c: d < 0.2 ? '#fff4d6' : Math.random() < 0.3 ? c2 : Math.random() < 0.4 ? c : '#cfe0ff' };
        });
        draw = (g, t, W, H) => {
            const a = Math.min(1, fxK(t, 0, 900)) * (t > vd ? fxEnv(t, vd, vd + 8600, 1, 2000) : 1);
            astralNight(g, cx, cy, W, H, a * 0.96, 0.3);
            sky(g, t, a * 0.6);
            const R = Math.min(W, H) * 0.55 * (0.35 + 0.65 * fxK(t, 0, vd));
            const spin = t / 1800 + fxK(t, 0, vd) * 2;
            g.globalCompositeOperation = 'lighter';
            stars.forEach(s => {
                const ang = s.arm * 2.094 + s.d * 4.2 + s.j - spin * (1.2 - s.d * 0.6);
                const r = s.d * R;
                const x = cx + Math.cos(ang) * r;
                const y = cy + Math.sin(ang) * r * 0.55;
                g.globalAlpha = a * (0.35 + (1 - s.d) * 0.5);
                g.fillStyle = s.c;
                g.fillRect(x, y, 1.6, 1.6);
            });
            g.globalCompositeOperation = 'source-over';
            let pulse = 0;
            hb.forEach(ms => {
                pulse = Math.max(pulse, fxEnv(t, ms, ms + 400, 40, 340));
            });
            astralGlow(g, cx, cy, 40 + pulse * 30 + (t > vd ? 120 * fxEnv(t, vd, vd + 2500, 60, 2000) : 0), '#fff4d6', a * (0.6 + pulse * 0.4));
            if (t > vd) {
                const j = fxEnv(t, vd, vd + 5500, 150, 1800) * a;
                [-1, 1].forEach(d => {
                    const gr = g.createLinearGradient(cx, cy, cx, cy + d * H * 0.7);
                    gr.addColorStop(0, 'rgba(255,255,255,' + 0.7 * j + ')');
                    gr.addColorStop(0.4, c + '88');
                    gr.addColorStop(1, 'rgba(0,0,0,0)');
                    g.fillStyle = gr;
                    g.globalCompositeOperation = 'lighter';
                    g.beginPath();
                    g.moveTo(cx - 6, cy);
                    g.lineTo(cx - 30, cy + d * H * 0.7);
                    g.lineTo(cx + 30, cy + d * H * 0.7);
                    g.lineTo(cx + 6, cy);
                    g.fill();
                    g.globalCompositeOperation = 'source-over';
                });
            }
            hb.forEach(ms => halo(g, t, ms, 700, 90, c, 1));
            [0, 160, 320].forEach((ms, i) => halo(g, t, vd + ms, 2200 + i * 300, 480 + i * 60, ['#fff', c, c2][i], 3 - i));
        };
        k.dof(0, vd, 4, 0.3);
        k.flash(vd - 40, 2000, '#fff', 0.9, 90);
        k.shake(k.game, vd, 1900, 22, 1);
        k.shockPage(vd + 40, 110, 5, 2.8);
        k.particles([
            { type: 'galaxy', at: vd, n: 300, cols: [c, c2, '#fff', '#cfe0ff'], speed: 1250, life: 3.4, size: 2.4, trail: 1, drag: 1.2, spin: -1.6 },
            { type: 'embers', at: vd + 800, until: vd + 7400, rate: 26, cols: [c, c2, '#fff'], life: 2.8, size: 1.8, wide: 1 }
        ], total);
    } else {
        // cosmic dawn
        const figs = Array.from({ length: Math.max(7, hb.length) }, (_, i) => {
            const an = i / Math.max(7, hb.length) * 6.28 + 0.3;
            const r = Math.min(W0, H0) * (0.3 + (i % 2) * 0.12);
            return astralFigure(cx + Math.cos(an) * r * 1.4, cy + Math.sin(an) * r, 90, 6);
        });
        draw = (g, t, W, H) => {
            const a = Math.min(1, fxK(t, 0, 1400)) * (t > vd ? fxEnv(t, vd, vd + 10000, 1, 2400) : 1);
            astralNight(g, cx, cy, W, H, a, t < vd ? 1 : 0.3);
            if (t < vd) {
                sky(g, t, a * fxK(t, 600, 2000));
                // one per beat, then they all fall in
                const fall = fxK(t, vd - 1000, vd);
                figs.forEach((C, i) => {
                    const ms = hb[i] != null ? hb[i] : 1500 + i * 400;
                    const moved = fall > 0 ? { pts: C.pts.map(p => ({ x: p.x + (cx - p.x) * fall * fall, y: p.y + (cy - p.y) * fall * fall, s: p.s })), edges: C.edges } : C;
                    astralDraw(g, moved, fxK(t, ms, ms + 700), a * (1 - fall * 0.6));
                });
                astralGlow(g, cx, cy, 20 + fxK(t, vd - 1000, vd) * 80, '#fff', fxK(t, vd - 1000, vd));
            } else {
                sky(g, t, a);
                const h = fxEnv(t, vd + 300, vd + 9800, 800, 2400) * a;
                g.globalAlpha = h * 0.7;
                g.strokeStyle = ASTRAL_GOLD;
                g.lineWidth = 2;
                g.beginPath();
                g.arc(cx, cy, Math.min(W, H) * 0.28, 0, 6.2832);
                g.stroke();
                g.globalAlpha = 1;
                for (let i = 0; i < 24; i++) {
                    const an = i * 0.2618 + (t - vd) / 4000;
                    astralStar(g, cx + Math.cos(an) * Math.min(W, H) * 0.28, cy + Math.sin(an) * Math.min(W, H) * 0.28, 1.6, i % 3 ? '#fff' : ASTRAL_GOLD, h, i % 6 === 0);
                }
                figs.forEach((C, i) => astralDraw(g, C, 1, h * 0.7));
            }
            [0, 180, 360, 540].forEach((ms, i) => halo(g, t, vd + ms, 2400 + i * 300, 520 + i * 60, ['#fff', ASTRAL_GOLD, c2, c][i], 3.5 - i * 0.6));
        };
        k.flash(vd - 60, 2600, '#fff', 1, 100);
        k.rays(vd + 300, 8200, 0.45, 120, ['#fff', ASTRAL_GOLD, c2, c], 40);
        k.aurora(vd + 600, 8400, [c, c2, '#7a5cff', '#3ff0ff'], 0.5);
        k.shake(k.game, vd + 100, 2200, 24, 1.2);
        k.trace(vd + 2400, 5600, ASTRAL_GOLD, 5, 4);
        k.reelGlow(vd + 2400, 6000, ASTRAL_GOLD, 1.1);
        k.particles([
            { type: 'galaxy', at: vd + 100, n: 320, cols: ['#fff', ASTRAL_GOLD, c, c2], speed: 1500, life: 3.8, size: 2.5, trail: 1, drag: 1.1, spin: 1.2 },
            { type: 'stars', at: vd + 1400, n: 160, cols: ['#ffffff', '#fff2c4'], life: 6, size: 1.5, pull: -40, rot: 0.06 },
            { type: 'embers', at: vd + 1200, until: vd + 9200, rate: 30, cols: ['#fff', ASTRAL_GOLD, c], life: 3, size: 1.8, wide: 1 }
        ], total);
    }
    fxScene(k, total, draw);
}
const FX_SKINS = { retro: retroFx, astral: astralFx };
const QS_COLS = ['#ff5a6e', '#5ef0a0', '#5aa8ff'];
let qsSprites = null;
function qsSprite(i) {
    if (!qsSprites) {
        qsSprites = QS_COLS.map(c => {
            const s = document.createElement('canvas');
            s.width = s.height = 64;
            const x = s.getContext('2d');
            const gr = x.createRadialGradient(32, 32, 0, 32, 32, 32);
            gr.addColorStop(0, '#ffffff');
            gr.addColorStop(0.16, '#ffffff');
            gr.addColorStop(0.3, c);
            gr.addColorStop(0.55, c + '55');
            gr.addColorStop(1, c + '00');
            x.fillStyle = gr;
            x.fillRect(0, 0, 64, 64);
            return s;
        });
    }
    return qsSprites[i];
}
const SCAN_SKIN = {
    '': { fg: '#cfe3da', st: '#9fe0c8', hi: '#eef3ef' },
    oscilloscope: { fg: '#7dff9a', st: '#3dff6e', hi: '#d8ffe0' },
    holographic: { fg: '#d9fbff', st: '#ff7ce6', hi: '#ffffff' },
    warp: { fg: '#dfe8ff', st: '#9fb8ff', hi: '#ffffff' }
};
function skinLayer(g, sk, t, W, H, q) {
    g.save();
    if (sk === 'oscilloscope') {
        g.strokeStyle = '#7dff9a';
        g.lineWidth = 1;
        g.globalAlpha = 0.12;
        g.beginPath();
        for (let i = 1; i < 10; i++) {
            g.moveTo(W * i / 10, 0);
            g.lineTo(W * i / 10, H);
        }
        for (let i = 1; i < 8; i++) {
            g.moveTo(0, H * i / 8);
            g.lineTo(W, H * i / 8);
        }
        g.stroke();
        g.globalAlpha = 0.25;
        g.beginPath();
        for (let i = 0; i <= 50; i++) {
            g.moveTo(W * i / 50, H / 2 - 3);
            g.lineTo(W * i / 50, H / 2 + 3);
        }
        g.stroke();
        const A = H * 0.24 * (1 - q);
        g.globalAlpha = 0.85;
        g.strokeStyle = '#3dff6e';
        g.lineWidth = 2;
        g.shadowColor = '#3dff6e';
        g.shadowBlur = 10;
        g.beginPath();
        for (let x = 0; x <= W; x += 3) {
            const y = H / 2 + A * (0.6 * Math.sin(x / W * 18.85 + t / 180) + 0.3 * Math.sin(x * 0.071 - t / 90) + 0.1 * Math.sin(x * 0.53 + t / 40));
            if (x) {
                g.lineTo(x, y);
            } else {
                g.moveTo(x, y);
            }
        }
        g.stroke();
    } else if (sk === 'holographic') {
        const x0 = ((t / 1700) % 1.6 - 0.3) * W;
        const gr = g.createLinearGradient(x0 - W * 0.25, 0, x0 + W * 0.25, H * 0.4);
        gr.addColorStop(0, 'rgba(63,240,255,0)');
        gr.addColorStop(0.35, 'rgba(63,240,255,.10)');
        gr.addColorStop(0.5, 'rgba(255,255,255,.16)');
        gr.addColorStop(0.65, 'rgba(255,79,216,.10)');
        gr.addColorStop(1, 'rgba(255,79,216,0)');
        g.fillStyle = gr;
        g.fillRect(0, 0, W, H);
        g.globalAlpha = 0.06;
        for (let y = (t / 30) % 6; y < H; y += 6) {
            g.fillStyle = (y | 0) % 12 < 6 ? '#3ff0ff' : '#ff4fd8';
            g.fillRect(0, y, W, 1);
        }
    } else if (sk === 'warp') {
        const M = Math.max(W, H) * 0.75;
        g.strokeStyle = '#9fb8ff';
        g.lineWidth = 1.5;
        for (let k = 0; k < 6; k++) {
            const f = (t / 900 + k / 6) % 1;
            g.globalAlpha = (1 - f) * 0.35 * (1 - q);
            g.beginPath();
            g.ellipse(W / 2, H / 2, f * f * M, f * f * M * 0.62, 0, 0, 6.2832);
            g.stroke();
        }
        const gr = g.createRadialGradient(W / 2, H / 2, 0, W / 2, H / 2, H * 0.4);
        gr.addColorStop(0, 'rgba(220,230,255,' + 0.35 * (1 - q) + ')');
        gr.addColorStop(1, 'rgba(220,230,255,0)');
        g.globalAlpha = 1;
        g.fillStyle = gr;
        g.fillRect(0, 0, W, H);
    }
    g.restore();
}
const EV_HUD = { storm: ['QUARK STORM', '#f0c419'], collider: ['SUPERCOLLIDER', '#5fd4ff'], hole: ['BLACK HOLE', '#ff9a3c'] };
function evLayer(g, ev, t, W, H, f) {
    const cx = W / 2;
    const cy = H / 2;
    g.save();
    if (ev === 'collider') {
        const rx = W * 0.42;
        const ry = H * 0.3;
        g.globalAlpha = 0.35 * f;
        g.strokeStyle = '#5fd4ff';
        g.lineWidth = 6;
        g.beginPath();
        g.ellipse(cx, cy, rx, ry, 0, 0, 6.2832);
        g.stroke();
        g.globalAlpha = 0.7 * f;
        g.lineWidth = 1;
        g.stroke();
        const n = 5;
        const gap = 6.2832 / n;
        const sp = t / 520;
        const bunch = (a, col, dir) => {
            for (let s = 0; s < 5; s++) {
                const b = a - dir * s * 0.035;
                g.globalAlpha = f * (1 - s / 5);
                g.fillStyle = col;
                g.beginPath();
                g.arc(cx + Math.cos(b) * rx, cy + Math.sin(b) * ry, 3.2 - s * 0.45, 0, 6.2832);
                g.fill();
            }
        };
        for (let k = 0; k < n; k++) {
            bunch(sp + k * gap, '#5fd4ff', 1);
            bunch(-sp + k * gap + gap / 2, '#ff6fae', -1);
        }
        // collisions
        for (let k = 0; k < n; k++) {
            for (let j = 0; j < n; j++) {
                const a1 = sp + k * gap;
                const a2 = -sp + j * gap + gap / 2;
                const dd = Math.atan2(Math.sin(a1 - a2), Math.cos(a1 - a2));
                if (Math.abs(dd) >= 0.16) {
                    continue;
                }
                const a = a2 + dd / 2;
                const x = cx + Math.cos(a) * rx;
                const y = cy + Math.sin(a) * ry;
                const r = 26 * (1 - Math.abs(dd) / 0.16);
                const gr = g.createRadialGradient(x, y, 0, x, y, r);
                gr.addColorStop(0, 'rgba(255,255,255,' + 0.9 * f + ')');
                gr.addColorStop(0.4, 'rgba(255,224,150,' + 0.5 * f + ')');
                gr.addColorStop(1, 'rgba(255,224,150,0)');
                g.globalAlpha = 1;
                g.fillStyle = gr;
                g.beginPath();
                g.arc(x, y, r, 0, 6.2832);
                g.fill();
            }
        }
    } else {
        const R = Math.min(W, H) * 0.13;
        const disc = front => {
            for (let k = 0; k < 90; k++) {
                const a = k / 90 * 6.2832 + t / (900 + (k % 7) * 120);
                const s = Math.sin(a);
                if ((s > 0) !== front) {
                    continue;
                }
                const rr = R * (1.5 + (k % 9) * 0.12);
                g.globalAlpha = f * (0.35 + 0.5 * ((k * 37) % 10) / 10);
                g.fillStyle = k % 3 ? '#ff9a3c' : '#ffe2a8';
                g.beginPath();
                g.arc(cx + Math.cos(a) * rr, cy + s * rr * 0.28, 1.6 + (k % 4) * 0.5, 0, 6.2832);
                g.fill();
            }
        };
        disc(false);
        const gr = g.createRadialGradient(cx, cy, R * 0.8, cx, cy, R * 1.9);
        gr.addColorStop(0, 'rgba(255,154,60,' + 0.55 * f + ')');
        gr.addColorStop(1, 'rgba(255,154,60,0)');
        g.globalAlpha = 1;
        g.fillStyle = gr;
        g.beginPath();
        g.arc(cx, cy, R * 1.9, 0, 6.2832);
        g.fill();
        g.globalAlpha = f;
        g.fillStyle = '#000';
        g.beginPath();
        g.arc(cx, cy, R, 0, 6.2832);
        g.fill();
        disc(true);
    }
    g.restore();
}
function scanField(reel, syms, labels, scores, dur, targets, ev) {
    const storm = ev === 'storm';
    const sk = scannerSkin();
    const SK = SCAN_SKIN[sk];
    const N = labels.length;
    const W = reel.clientWidth;
    const H = reel.clientHeight;
    if (!W || matchMedia('(prefers-reduced-motion: reduce)').matches) {
        return new Promise(r => setTimeout(r, Math.min(dur, 600)));
    }
    const cv = document.createElement('canvas');
    const dpr = Math.min(2, devicePixelRatio || 1);
    cv.width = W * dpr;
    cv.height = H * dpr;
    reel.appendChild(cv);
    const g = cv.getContext('2d');
    g.scale(dpr, dpr);
    const cs = getComputedStyle(syms[0]);
    const fam = cs.fontFamily;
    const base = Math.min(parseFloat(cs.fontSize) || 80, N > 1 ? 84 : 999);
    g.font = '700 ' + base + 'px ' + fam;
    const fsA = targets ? targets.map(t => t.fs) : labels.map(l => {
        const room = W / N - (N > 1 ? 24 : 30);
        const tw = g.measureText(l).width;
        return tw > room ? base * room / tw : base;
    });
    if (N > 1 && !targets) {
        syms.forEach((e, i) => e.style.fontSize = fsA[i] + 'px');
    }
    const ACC = ['#f0c419'].concat(RARITY_FX.slice(1).map(x => x.c));
    const tiers = scores.map(getRarityTier);
    const tier = Math.max(...tiers);
    const acc = ACC[tier];
    const Pp = H * 0.9;
    const t0 = performance.now();
    const sm = x => {
        x = Math.max(0, Math.min(1, x));
        return x * x * (3 - 2 * x);
    };
    const spawn = (p, d, c) => {
        p.z = c + d;
        p.x = (Math.random() - 0.5) * (W / Pp) * d * 1.25;
        p.y = (Math.random() - 0.5) * (H / Pp) * d * 1.25;
        p.s = 0.25 + Math.random() * 0.45;
        p.t = ELEMENTS[Math.random() * ELEMENTS.length | 0][0];
        return p;
    };
    const P = Array.from({ length: 150 }, () => spawn({}, 0.6 + Math.pow(Math.random(), 0.8) * 13.4, -9));
    // storm quarks: k = 0 for a lone quark (colour c), 1 for a bound three
    const qSpawn = (p, d, c) => {
        spawn(p, d, c);
        p.k = Math.random() < 0.28 ? 1 : 0;
        p.c = Math.random() * 3 | 0;
        p.w = (0.5 + Math.random() * 0.9) * (Math.random() < 0.85 ? 1 : -1);
        p.r0 = Math.hypot(p.x, p.y);
        p.a0 = Math.atan2(p.y, p.x);
        p.sp = Math.random() * 6.3;
        return p;
    };
    const Q = storm ? Array.from({ length: Math.round(Math.min(70, Math.max(44, W * H / 4500))) }, () => qSpawn({}, 0.8 + Math.random() * 13, -9)) : [];
    const S = Math.max(120, 1350 * dur / 3000);
    const T1 = S + 600;
    const total = S + 1650;
    const two = labels.map(() => Math.random() < 0.5);
    const T = labels.map((l, i) => N === 1 ? { x: (Math.random() < 0.5 ? -1 : 1) * (1.2 + Math.random() * 1.6), y: (Math.random() - 0.5) * 1.6 } : { x: ((i + 0.5) / N - 0.5) * 5.5 + (Math.random() - 0.5) * 1.2, y: (Math.random() - 0.5) * 2 });
    const mx = T.reduce((a, b) => a + b.x, 0) / N;
    const my = T.reduce((a, b) => a + b.y, 0) / N;
    return new Promise(res => {
        let done = false;
        const fin = () => {
            if (done) {
                return;
            }
            done = true;
            cv.remove();
            res();
        };
        setTimeout(fin, total + 1200);
        (function frame(now) {
            if (done) {
                return;
            }
            const t = now - t0;
            const u = t >= total ? 1 : t < S ? 0.45 * t / S : t < T1 ? 0.45 + 0.2 * (t - S) / 600 : 0.65 + 0.35 * (t - T1) / 1050;
            const q = u < 0.65 ? 0 : (u - 0.65) / 0.35;
            const D = u < 0.65 ? 8 - 3 * u / 0.65 : 5 * (1 - q * q);
            const dt = 1 + D;
            const cz = -dt;
            const w = sm((u - 0.45) / 0.35);
            const w2 = sm((u - 0.55) / 0.45);
            const ur = t / 3000;
            const cxw = Math.sin(ur * 9) * 2.4 * (1 - w) + mx * w;
            const cyw = Math.cos(ur * 6) * 1.2 * (1 - w) + my * w;
            g.clearRect(0, 0, W, H);
            g.textAlign = 'center';
            g.textBaseline = 'middle';
            g.lineCap = 'round';
            if (sk) {
                skinLayer(g, sk, t, W, H, q);
            }
            const pr = (x, y, d) => [W / 2 + (x - cxw) * Pp / d, H / 2 + (y - cyw) * Pp / d];
            P.forEach(p => {
                let d = p.z - cz;
                if (d < 0.35) {
                    spawn(p, 13 + Math.random() * 2, cz);
                    d = p.z - cz;
                }
                let px = p.x;
                let py = p.y;
                if (ev === 'hole') {
                    const k = Math.min(1, d / 9);
                    const sw = (1 - k) * 2.2 + t / 2600;
                    px = (p.x * Math.cos(sw) - p.y * Math.sin(sw)) * (0.35 + 0.65 * k);
                    py = (p.x * Math.sin(sw) + p.y * Math.cos(sw)) * (0.35 + 0.65 * k);
                }
                const [sx, sy] = pr(px, py, d);
                if (sx < -60 || sx > W + 60 || sy < -60 || sy > H + 60) {
                    return;
                }
                const a = Math.min(1, (d - 0.35) / 0.9) * (d > 10 ? (14 - d) / 4 : 1) * 0.8 * (1 - q * 0.92) * (ev === 'hole' ? Math.min(1, d / 3) : 1);
                if (a <= 0) {
                    return;
                }
                if (q > 0 || sk === 'warp') {
                    const [ex, ey] = pr(px, py, d + q * q * 3.5 + (sk === 'warp' ? 0.9 : 0));
                    g.globalAlpha = a * 0.7;
                    g.strokeStyle = tier ? acc : SK.st;
                    g.lineWidth = 1.5;
                    g.beginPath();
                    g.moveTo(sx, sy);
                    g.lineTo(ex, ey);
                    g.stroke();
                }
                g.globalAlpha = a;
                g.font = '700 ' + Math.max(5, base * p.s / d) + 'px ' + fam;
                if (sk === 'holographic') {
                    g.globalAlpha = a * 0.6;
                    g.fillStyle = '#ff4fd8';
                    g.fillText(p.t, sx - 1.5, sy);
                    g.fillStyle = '#3ff0ff';
                    g.fillText(p.t, sx + 1.5, sy);
                    g.globalAlpha = a;
                }
                g.fillStyle = SK.fg;
                g.fillText(p.t, sx, sy);
            });
            if (ev === 'collider' || ev === 'hole') {
                evLayer(g, ev, t, W, H, 1 - q);
            }
            Q.forEach(p => {
                let d = p.z - cz;
                if (d < 0.35) {
                    qSpawn(p, 13 + Math.random() * 2, cz);
                    d = p.z - cz;
                }
                // swirl round the centre of the field, faster as they come close
                const spin = p.w * (1.2 + 3 / d);
                const ang = p.a0 + spin * t / 1000;
                const [sx, sy] = pr(Math.cos(ang) * p.r0, Math.sin(ang) * p.r0, d);
                if (sx < -40 || sx > W + 40 || sy < -40 || sy > H + 40) {
                    return;
                }
                const a = Math.min(1, (d - 0.35) / 0.9) * (d > 10 ? (14 - d) / 4 : 1) * (1 - q * 0.95);
                if (a <= 0) {
                    return;
                }
                const r = Math.max(1.8, base * 0.085 / d);
                const glow = r * 3.4;
                // a short trail along the swirl
                g.globalAlpha = a * 0.4;
                g.strokeStyle = QS_COLS[p.c];
                g.lineWidth = Math.max(1, r * 0.7);
                g.beginPath();
                for (let s = 0; s <= 6; s++) {
                    const b2 = ang - spin * s * 0.035;
                    const [tx, ty] = pr(Math.cos(b2) * p.r0, Math.sin(b2) * p.r0, d + s * 0.05);
                    if (s) {
                        g.lineTo(tx, ty);
                    } else {
                        g.moveTo(tx, ty);
                    }
                }
                g.stroke();
                g.globalAlpha = a;
                if (!p.k) {
                    g.drawImage(qsSprite(p.c), sx - glow, sy - glow, glow * 2, glow * 2);
                    return;
                }
                const turn = p.sp + t / 420 * p.w;
                const pts = [0, 1, 2].map(j => [sx + Math.cos(turn + j * 2.094) * r * 2.4, sy + Math.sin(turn + j * 2.094) * r * 2.4]);
                if (r > 1.8) {
                    g.globalAlpha = a * 0.55;
                    g.strokeStyle = '#f0c419';
                    g.lineWidth = Math.max(0.6, r * 0.28);
                    g.beginPath();
                    pts.forEach((A, j) => {
                        const B = pts[(j + 1) % 3];
                        const nx = -(B[1] - A[1]);
                        const ny = B[0] - A[0];
                        const L = Math.hypot(nx, ny) || 1;
                        for (let s = 0; s <= 8; s++) {
                            const f = s / 8;
                            const o = Math.sin(f * Math.PI * 4 + t / 90) * r * 0.45 * Math.sin(f * Math.PI);
                            const X = A[0] + (B[0] - A[0]) * f + nx / L * o;
                            const Y = A[1] + (B[1] - A[1]) * f + ny / L * o;
                            if (s) {
                                g.lineTo(X, Y);
                            } else {
                                g.moveTo(X, Y);
                            }
                        }
                    });
                    g.stroke();
                    g.globalAlpha = a;
                }
                const gl = glow * 0.75;
                pts.forEach((A, j) => g.drawImage(qsSprite(j), A[0] - gl, A[1] - gl, gl * 2, gl * 2));
            });
            const st = 0.45 + 0.55 * sm((u - 0.55) / 0.1);
            T.forEach((tg, i) => {
                const [px, py] = pr(tg.x, tg.y, dt);
                const sx = px + ((targets ? targets[i].x : W * (i + 0.5) / N) - px) * w2;
                const sy = py + ((targets ? targets[i].y : H / 2) - py) * w2;
                const sz = fsA[i] * st / dt;
                const o = i * 40;
                const ac = ACC[tiers[i]];
                const hl = t >= T1 - 60 || (t >= T1 - 240 + o && t < T1 - 150 + o) || (two[i] && t >= T1 - 450 + o && t < T1 - 360 + o);
                g.globalAlpha = 1;
                if (hl) {
                    const h = Math.max(16, sz * 0.9) * (1 + (1 - w) * 0.6);
                    g.strokeStyle = ac;
                    g.lineWidth = 2;
                    g.beginPath();
                    [[-1, -1], [1, -1], [1, 1], [-1, 1]].forEach(([a, b]) => {
                        g.moveTo(sx + a * h, sy + b * h * 0.7 - b * 8);
                        g.lineTo(sx + a * h, sy + b * h * 0.7);
                        g.lineTo(sx + a * h - a * 8, sy + b * h * 0.7);
                    });
                    if (u < 0.95) {
                        g.stroke();
                    }
                }
                g.globalAlpha = hl ? 1 : 0.8 * Math.min(1, (dt - 0.35) / 0.9);
                g.fillStyle = hl ? (u > 0.65 ? SK.hi : ac) : SK.fg;
                g.font = '700 ' + sz + 'px ' + fam;
                g.fillText(labels[i], sx, sy);
            });
            g.globalAlpha = 0.9;
            g.fillStyle = acc;
            g.font = '600 11px ' + fam;
            g.textBaseline = 'alphabetic';
            g.textAlign = 'left';
            g.fillText(u < 0.65 ? 'FIELD SCAN' : (N > 1 ? 'LOCK x' + N : 'LOCK'), 18, 26);
            g.textAlign = 'right';
            g.fillText('RNG ' + D.toFixed(1), W - 18, 26);
            if (ev) {
                g.textAlign = 'left';
                g.fillStyle = EV_HUD[ev][1];
                g.globalAlpha = 0.75 + 0.25 * Math.sin(t / 160);
                g.fillText(EV_HUD[ev][0], 18, H - 18);
                g.fillStyle = acc;
                g.globalAlpha = 0.9;
            }
            g.textBaseline = 'middle';
            g.textAlign = 'center';
            if (u < 0.65) {
                g.globalAlpha = 0.25;
                g.strokeStyle = SK.fg;
                g.lineWidth = 1;
                g.beginPath();
                g.moveTo(W / 2 - 10, H / 2);
                g.lineTo(W / 2 + 10, H / 2);
                g.moveTo(W / 2, H / 2 - 10);
                g.lineTo(W / 2, H / 2 + 10);
                g.stroke();
            }
            if (u >= 1) {
                fin();
            } else {
                requestAnimationFrame(frame);
            }
        })(performance.now());
    });
}
function showAchievementToast(a) {
    const toast = $('achievementToast');
    $('achievementToastKicker').textContent = a.kicker || 'Achievement unlocked';
    $('achievementToastName').textContent = a.name;
    $('achievementToastDesc').textContent = a.flavor;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 4200);
}
function checkAchievements(record) {
    const matches = ACHIEVEMENTS.filter(a => a.hill === record.formula && !unlockedAchievements.includes(a.formula));
    matches.forEach(a => {
        unlockedAchievements.push(a.formula);
        showAchievementToast(a);
    });
    if (matches.length) {
        try {
            localStorage.setItem('elementalAchievements', JSON.stringify(unlockedAchievements));
        } catch (e) { }
        renderAchievements();
    }
}
function renderAchievements() {
    const root = $('achievementGrid');
    if (!root) {
        return;
    }
    const q = $('achievementSearch').value.toLowerCase().trim();
    const filter = $('achievementFilter').value;
    const count = unlockedAchievements.length;
    const total = ACHIEVEMENTS.length;
    $('achievementProgress').textContent = `${count} of ${total} found`;
    $('achievementHeaderCount').textContent = `${count}/${total}`;
    $('achievementBar').style.width = `${total ? count / total * 100 : 0}%`;
    if ($('homeAch')) {
        $('homeAch').textContent = `${count} / ${total}`;
    }
    const list = ACHIEVEMENTS.filter(a => {
        const unlocked = unlockedAchievements.includes(a.formula);
        return (filter === 'all' || (filter === 'unlocked' && unlocked) || (filter === 'locked' && !unlocked)) && (!q || (a.formula + a.name + a.flavor + a.rarity).toLowerCase().includes(q));
    });
    root.innerHTML = '';
    if (!list.length) {
        root.innerHTML = '<div class="empty"><strong>No matches</strong><p>Try a different search or filter.</p></div>';
        return;
    }
    list.forEach(a => {
        const unlocked = unlockedAchievements.includes(a.formula);
        const row = document.createElement('div');
        row.className = 'ach-row ' + (unlocked ? 'found' : 'missing');
        row.innerHTML = `<span class="ach-mark" aria-hidden="true"></span><span class="ach-formula">${unlocked ? a.formula : '???'}</span><div class="ach-main"><div class="ach-name">${unlocked ? a.name : 'Not found yet'}</div><div class="ach-flavor">${unlocked ? a.flavor : 'Roll this formula to see what it is.'}</div></div><span class="ach-rarity rarity-${a.rarity.toLowerCase()}">${a.rarity}</span>`;
        root.appendChild(row);
    });
}
let achNameByFormula = null;
function recordFromFormula(formula, count, spent, ionP, ionN) {
    if (typeof formula !== 'string' || !formula) {
        return null;
    }
    const elements = [];
    const re = /([A-Z][a-z]?)(\d*)/g;
    let m;
    while ((m = re.exec(formula))) {
        const e = elementBySymbol[m[1]];
        if (!e) {
            return null;
        }
        for (let i = 0; i < (+m[2] || 1); i++) {
            elements.push(e);
        }
    }
    if (!elements.length) {
        return null;
    }
    if (!achNameByFormula) {
        achNameByFormula = new Map(ACHIEVEMENTS.map(a => [normalizeFormula(a.formula), a.name]));
    }
    // the same odds and score sums as exactRarity and rollScore
    let log = -(elements.length - 1) * Math.log10(8);
    let score = 0;
    elements.forEach(e => {
        log -= Math.log10(e[2]);
        score += e[2];
    });
    const name = elements.length === 1 ? elements[0][1] : (achNameByFormula.get(formula) || elements.map(e => e[1]).join(' + '));
    const r = { formula, name, elements, rarity: rarityText(log), log, score, count: Math.max(1, Math.floor(+count) || 1) };
    if (spent > 0) {
        r.spent = Math.floor(+spent);
    }
    if (ionP > 0) {
        r.ionP = Math.min(3, Math.floor(ionP));
    }
    if (ionN > 0) {
        r.ionN = Math.min(3, Math.floor(ionN));
    }
    return r;
}
function unpackCollection(raw) {
    if (!Array.isArray(raw)) {
        return [];
    }
    const out = [];
    const seen = new Map();
    raw.forEach(x => {
        const r = Array.isArray(x) ? recordFromFormula(x[0], x[1], x[2], x[3], x[4]) : x && recordFromFormula(x.formula, x.count, x.spent);
        if (!r) {
            return;
        }
        const dup = seen.get(r.formula);
        if (dup) {
            dup.count += r.count;
            dup.spent = (dup.spent || 0) + (r.spent || 0) || undefined;
            dup.ionP = Math.max(dup.ionP || 0, r.ionP || 0) || undefined;
            dup.ionN = Math.max(dup.ionN || 0, r.ionN || 0) || undefined;
            return;
        }
        seen.set(r.formula, r);
        out.push(r);
    });
    return out;
}
function packCollection() {
    return JSON.stringify(collection.map(c => c.ionP || c.ionN ? [c.formula, c.count || 1, c.spent || 0, c.ionP || 0, c.ionN || 0] :
        c.spent > 0 ? [c.formula, c.count || 1, c.spent] : [c.formula, c.count || 1]));
}
let collection = [];
try {
    collection = unpackCollection(JSON.parse(localStorage.getItem('elementalCollection') || '[]'));
} catch (e) {
    collection = [];
}
// rolls and finds removed with "Clear redundant finds", so roll totals don't drop
let clearCleared = { rolls: 0, formulas: 0 };
try {
    clearCleared = Object.assign(clearCleared, JSON.parse(localStorage.getItem('elementalCleared') || '{}'));
} catch (e) { }
function totalRolls() {
    return collection.reduce((n, c) => n + (c.count || 1), 0) + (clearCleared.rolls || 0);
}
let rolling = false;
let autoRolling = false;
const formatNumber = n => Number(n).toLocaleString('en-US', { maximumFractionDigits: 3 });
let buffCache = null;
let weightCache = null;
function save() {
    buffCache = weightCache = null;
    if (typeof netVer === 'number') {
        netVer++;
    }
    try {
        localStorage.setItem('elementalCollection', packCollection());
    } catch (e) {
        // the device's storage is full: say so once, rather than silently losing progress
        if (!save.warned) {
            save.warned = true;
            setTimeout(() => showAchievementToast({ kicker: 'Storage full', name: "Progress isn't saving", flavor: 'This browser has run out of space for Elemental. Clear redundant finds in Settings to make room.' }), 0);
        }
    }
}
function addRecord(r) {
    // base odds/score stay, ions only mark the best
    const ion = r.ion || 0;
    const base = ion ? Object.assign({}, r, { log: r.baseLog, score: r.baseScore, rarity: rarityText(r.baseLog) }) : r;
    delete base.ion;
    delete base.baseLog;
    delete base.baseScore;
    let x = collection.find(c => c.formula === r.formula);
    if (!x) {
        base.count = 1;
        collection.push(base);
        x = base;
    } else {
        x.count = (x.count || 1) + 1;
        if (base.log < x.log || !Number.isFinite(x.log)) {
            Object.assign(x, {
                log: base.log, rarity: base.rarity, score: base.score, when: base.when, elements: base.elements, id: base.id, name: base.name
            });
        }
    }
    if (ion > 0) {
        x.ionP = Math.max(x.ionP || 0, ion);
    } else if (ion < 0) {
        x.ionN = Math.max(x.ionN || 0, -ion);
    }
}
function go(screen) {
    document.querySelectorAll('.screen').forEach(s => s.classList.toggle('active', s.id === screen));
    window.scrollTo(0, 0);
    requestAnimationFrame(() => ionShowNew());
    if (screen === 'bonds') {
        renderBonds();
    }
    if (screen === 'shop') {
        $('shopMsg').textContent = '';
        renderShop();
    }
    if (screen === 'catinv') {
        renderCatInv();
    }
    if (screen === 'settings' && typeof renderStorage === 'function') {
        jokeUiSync();
        tierRowsSync();
        renderStorage();
        renderViewer();
    }
    if (screen === 'admin' && typeof renderAdmin === 'function') {
        renderAdmin();
    }
    if (screen === 'global' && typeof renderGlobal === 'function') {
        renderGlobal();
        globalLoad();
    }
    if (screen === 'game') {
        const col = document.querySelector('#rollResults .roll-result-column');
        if (col && col._mr) {
            col.querySelectorAll('.mr-chip b').forEach(b => fitText(b, b.textContent, b.parentElement.clientWidth - 10, 18));
            const sel = [...col.querySelectorAll('.mr-chip')].findIndex(c => c.classList.contains('sel'));
            showMultiRoll(col, col._mr.records, Math.max(0, sel), col._mr.best, false);
        }
    }
}
document.querySelectorAll('[data-go]').forEach(b => b.addEventListener('click', () => go(b.dataset.go)));
document.querySelectorAll('[data-tab]').forEach(b => b.addEventListener('click', () => {
    let tab = b.dataset.tab;
    document.querySelectorAll('[data-tab]').forEach(x => x.classList.toggle('active', x === b));
    $('compoundView').style.display = tab === 'compounds' ? '' : 'none';
    $('completionView').style.display = tab === 'completionist' ? '' : 'none';
    if (tab === 'completionist') {
        renderPeriodic();
        ionShowNew();
    }
}));
// Exactly three elements grant an extra roll per click.
const EXTRA_ROLL_SYMBOLS = new Set(['Ho']);
const CHAIN_SYMBOLS = new Set(['Rn', 'Bk', 'Ds', 'Og']);
const AUTO_UNLOCK_SYMBOL = 'Pt';
const AUTO_TIME_SYMBOLS = new Set(['Cs', 'Sm', 'Os', 'Tm', 'Ac']);
const AUTO_COOL_SYMBOLS = new Set(['Pr', 'Lu', 'Rh', 'Pa', 'Po']);
const AUTO_BASE_GAP = 5;
const AUTO_MIN_GAP = 0.5;
const AUTO_SPEED_STEP = 10;
function buildBuffs() {
    const raw = e => Math.log10(e[2] + 1) + 0.5;
    const kind = (e, i) => EXTRA_ROLL_SYMBOLS.has(e[0]) ? 'extra' : CHAIN_SYMBOLS.has(e[0]) ? 'chain' : e[0] === AUTO_UNLOCK_SYMBOL ? 'autounlock' : AUTO_TIME_SYMBOLS.has(e[0]) || AUTO_COOL_SYMBOLS.has(e[0]) ? 'autospeed' : i % 4 === 1 ? 'speed' : 'luck';
    const sum = { speed: 0, luck: 0 };
    const goal = { speed: 200, luck: 100 };
    ELEMENTS.forEach((e, i) => {
        const k = kind(e, i);
        if (k in sum) {
            sum[k] += raw(e);
        }
    });
    return new Map(ELEMENTS.map((e, i) => {
        const k = kind(e, i);
        if (k === 'extra') {
            return [
                e[0],
                {
                    type: 'extra', value: 1, desc: 'Bonus roll +1: every click launches one separate additional roll, with its own independent chance of a chain reaction. Two more bonus rolls come from deep lines in the bond network, for a maximum of three.'
                }
            ];
        }
        if (k === 'chain') {
            return [
                e[0],
                {
                    type: 'chain', value: 1, desc: 'Chain chance +1 step: makes chain reactions more likely. Four rare elements and four deep bond lines each give a step, together taking the odds from 1 in 8 to 1 in 3.'
                }
            ];
        }
        if (k === 'autounlock') {
            return [
                e[0],
                {
                    type: 'autounlock', value: 1, desc: `Autoroll unlocked: switch autoroll on and it keeps rolling for as long as you like, with a ${AUTO_BASE_GAP} second break between rolls. Autoroll speed buffs shorten the break.`
                }
            ];
        }
        if (k === 'autospeed') {
            return [
                e[0],
                {
                    type: 'autospeed', value: AUTO_SPEED_STEP, desc: `Autoroll speed +${AUTO_SPEED_STEP}%: autoroll waits less between rolls once it is unlocked.`
                }
            ];
        }
        const v = raw(e) * goal[k] / sum[k];
        return [e[0], k === 'speed' ? { type: 'speed', value: v, desc: `Scanner speed +${v.toFixed(2)}%: each roll animation finishes faster.` } : {
                type: 'luck', value: v, desc: `Luck +${v.toFixed(2)}%: shifts the scanner's weighting toward rarer elements.`
            }];
    }));
}
const ELEMENT_BUFFS = buildBuffs();
// jokes don't count
function discoveredSymbols() {
    const set = new Set();
    collection.forEach(c => (c.elements || []).forEach(e => set.add(e[0])));
    JOKE_SYMS.forEach(s => set.delete(s));
    return set;
}
let jokeFoundCache = null;
function jokesFound() {
    if (jokeFoundCache && jokeFoundCache.n === collection.length) {
        return jokeFoundCache.s;
    }
    const s = new Set();
    collection.forEach(c => (c.elements || []).forEach(e => {
        if (isJoke(e[0])) {
            s.add(e[0]);
        }
    }));
    jokeFoundCache = { n: collection.length, s };
    return s;
}
// Bond network
const NET_SEED = 20261021;
const NET_QTY = 23;
const NET_FAM_QTY = 23;
const NET_QTY_GROWTH = 1.42;
// how strongly each line buff is weighted toward the outer rings
const NET_WEIGHT = { luck: 2.5, auto: 1.6, price: 0.6, refresh: 0.6, stock: 0.6 };
const NET_RINGS = 24;
const NET_STEP = 130;
const NET_MIN_GAP = 74;
const NET_TOTALS = {
    luck: 120, auto: 800, price: 30, refresh: 8, stock: 60
};
const NET_MULTS = [1.04, 1.05, 1.06, 1.08, 1.1, 1.2, 1.35, 1.5];
const NET_SLOT_RINGS = [4, 10, 17];
const NET_CHAIN_RINGS = [13, 17, 20, 23];
const NET_EXTRA_RINGS = [10, 15];
// outer ring 1 = rings 26-28 (25 is the gap)
const NET_RING_COL = ['#f0c419', '#7ddc5a', '#7ddc5a', '#7ddc5a', '#2fe0b0', '#2fe0b0', '#2fe0b0', '#35d0e0', '#35d0e0', '#35d0e0', '#5aa8ff', '#5aa8ff', '#5aa8ff', '#9b8cff', '#9b8cff', '#9b8cff', '#c77dff', '#e060ff', '#e060ff', '#ff5a8a', '#ff5a8a', '#ff7a5a', '#ff7a5a', '#ffb35a', '#ffe08a', '#ffe08a', '#3ff0ff', '#c45cff', '#ffd36e'];
const OUTER_SEED = 20261022;
const OUTER_ORBITS = 3;
const OUTER_PER_ORBIT = 207;
const OUTER_RADIUS = 3420;
const OUTER_STEP = 180;
const OUTER_BRIDGES = 6;
const OUTER_TOTALS = { quark: 100, event: 100, cdur: 50, dup: 25, refund: 25, storm: 100 };
const OUTER_SHARE = [['quark', 0.25], ['event', 0.2], ['cdur', 0.2], ['dup', 0.12], ['refund', 0.12], ['storm', 0.11]];
// each bridge unlocks a feature: [kind, cosmetic, what its outer slot asks for]
const BRIDGE_UNLOCKS = [['ion', 0, ['Co', 240]], ['hold', 0, ['Sb', 360]], ['cos', 'oscilloscope', ['Sc', 370]],
    ['slot', 0, ['Dy', 430]], ['joke', 0, ['Ho', 420]], ['jokecat', 0, ['Ac', 190]]];
// bridges in the order players reach their inner ends
const BRIDGE_ORDER = [3, 1, 5, 0, 2, 4];
// the rest of the cosmetics are out in the orbits: [orbit, cosmetic]
const OUTER_UNLOCKS = [[1, 'blueprint'], [1, 'holographic'], [2, 'notebook'], [2, 'retro'], [2, 'astral']];
const COSMETIC_NAMES = {
    oscilloscope: 'Oscilloscope scanner', holographic: 'Holographic scanner', blueprint: 'Blueprint page', notebook: 'Lab notebook page',
    retro: 'Retro spawn effects', astral: 'Astral spawn effects', warp: 'Warp scanner', gameover: 'Game Over page'
};
const FAMILY_ONE = {
    alkali: 'alkali metal', alkaline: 'alkaline earth metal', transition: 'transition metal', post: 'post-transition metal', metalloid: 'metalloid', nonmetal: 'nonmetal', halogen: 'halogen', noble: 'noble gas', lanth: 'lanthanide', actin: 'actinide', unknown: 'superheavy'
};
var NET = null;
var netState = {};
try {
    netState = JSON.parse(localStorage.getItem('elementalNetwork') || '{}');
} catch (e) { }
function saveNet() {
    try {
        localStorage.setItem('elementalNetwork', JSON.stringify(netState));
    } catch (e) { }
}
const seededRnd = a => () => {
    a |= 0;
    a = a + 0x6D2B79F5 | 0;
    let t = Math.imul(a ^ a >>> 15, 1 | a);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
};
function genNetwork() {
    const rnd = seededRnd(NET_SEED);
    const nodes = [{ id: 0, x: 0, y: 0, ring: 0, ang: 0 }];
    const edges = [];
    const near = (x, y, gap) => nodes.some(n => Math.hypot(n.x - x, n.y - y) < gap);
    let frontier = [];
    for (let k = 0; k < 6; k++) {
        const a = k * Math.PI / 3 - Math.PI / 2;
        const n = { id: nodes.length, x: Math.cos(a) * NET_STEP, y: Math.sin(a) * NET_STEP, ring: 1, ang: a, twist: (rnd() - 0.5) * 0.5 };
        nodes.push(n);
        edges.push({ a: 0, b: n.id });
        frontier.push(n);
    }
    for (let r = 2; r <= NET_RINGS; r++) {
        const next = [];
        frontier.forEach(p => {
            const roll = rnd();
            const kids = roll < 0.12 ? 0 : roll < 0.55 ? 1 : roll < 0.89 ? 2 : 3;
            for (let k = 0; k < kids; k++) {
                let placed = false;
                for (let tries = 0; tries < 7 && !placed; tries++) {
                    const spread = kids === 1 ? 0 : (k - (kids - 1) / 2) * (0.85 / r + 0.08);
                    const a = p.ang + p.twist / r * 3 + spread + (rnd() - 0.5) * (0.35 / r + 0.06) * (1 + tries);
                    const rad = r * NET_STEP + (rnd() - 0.5) * 40;
                    const x = Math.cos(a) * rad;
                    const y = Math.sin(a) * rad;
                    if (!near(x, y, NET_MIN_GAP)) {
                        const n = { id: nodes.length, x, y, ring: r, ang: a, twist: p.twist + (rnd() - 0.5) * 0.18 };
                        nodes.push(n);
                        edges.push({ a: p.id, b: n.id });
                        next.push(n);
                        placed = true;
                    }
                }
            }
        });
        // keep the outer rings from thinning out: revive a dead frontier from the ring before
        if (next.length < 8 && frontier.length) {
            frontier.slice(0, 8 - next.length).forEach(p => p.twist += 0.2);
        }
        frontier = next.length ? next : frontier;
    }
    // loops: join some neighbours from different branches
    const has = new Set(edges.map(e => Math.min(e.a, e.b) + '-' + Math.max(e.a, e.b)));
    for (let i = 1; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
            const A = nodes[i];
            const B = nodes[j];
            if (Math.abs(A.ring - B.ring) > 1) {
                continue;
            }
            const d = Math.hypot(A.x - B.x, A.y - B.y);
            if (d < NET_MIN_GAP * 1.45 && !has.has(i + '-' + j) && rnd() < 0.22) {
                edges.push({ a: i, b: j, join: true });
                has.add(i + '-' + j);
            }
        }
    }
    // what each slot asks for, getting rarer and larger further out
    const els = [...ELEMENTS].sort((a, b) => a[2] - b[2]);
    const RK = { Common: 0, Uncommon: 1, Rare: 2, Epic: 3, Legendary: 4 };
    const comps = [...ACHIEVEMENTS].filter(a => normalizeFormula(a.formula).match(/[A-Z]/g).length > 1).sort((a, b) => RK[a.rarity] - RK[b.rarity]);
    const fams = Object.keys(FAMILY_ONE);
    const famMin = f => Math.min(...ELEMENTS.filter(e => familyOf(e[0]) === f).map(e => e[2]));
    const pickEl = (R, r, lo, hi) => {
        const f = r / NET_RINGS;
        const top = Math.min(els.length - 2, Math.floor(els.length * Math.pow(f, 1.25) * hi + 4));
        const bot = Math.max(0, Math.floor(top * lo));
        return els[bot + Math.floor(R() * Math.max(1, top - bot))][0];
    };
    const reqFor = (r, R) => {
        const rr = r * 18 / NET_RINGS;
        if (r === 0) {
            return { t: 'el', k: 'O', n: 1 };
        }
        const roll = R();
        if (r <= 1 || roll < 0.34) {
            return { t: 'el', k: pickEl(R, r, 0.55, 1), n: 1 };
        } else if (roll < 0.6) {
            const k = pickEl(R, Math.max(1, r * 0.45), 0, 0.6);
            return { t: 'el', k, n: Math.max(2, Math.round(NET_QTY * 3 * Math.pow(NET_QTY_GROWTH, rr) / Math.pow(ELEMENTS.find(e => e[0] === k)[2], 0.55))) };
        } else if (roll < 0.74 && r >= 2) {
            const ok = fams.filter(f => famMin(f) <= Math.pow(10, 1 + rr * 0.33));
            const f = ok[Math.floor(R() * ok.length)];
            return { t: 'fam', k: f, n: Math.max(1, Math.round(NET_FAM_QTY * Math.pow(1.3, rr) / Math.pow(famMin(f), 0.3))) };
        } else if (roll < 0.9 && r >= 3) {
            const span = comps.length;
            const at = Math.min(span - 1, Math.floor(Math.pow((r - 2) / (NET_RINGS - 2), 1.1) * span * (0.6 + R() * 0.4)));
            const a = comps[at];
            return { t: 'cp', k: normalizeFormula(a.formula), l: a.formula, nm: a.name, n: 1 };
        }
        return { t: 'has', k: pickEl(R, r, 0.1, 0.55), n: 1 };
    };
    nodes.forEach(n => n.req = reqFor(n.ring, rnd));
    // what each line gives
    const outer = e => Math.max(nodes[e.a].ring, nodes[e.b].ring);
    const ringFirst = {};
    edges.forEach((e, i) => {
        const r = outer(e);
        e.ring = r;
        if (ringFirst[r] == null) {
            ringFirst[r] = i;
        }
    });
    const grind = n => {
        const q = n.req;
        return q.t === 'el' ? q.n * ELEMENTS.find(x => x[0] === q.k)[2] : q.t === 'fam' ? q.n * 60 : 0;
    };
    const used = new Set();
    const special = (r, kind, val) => {
        let best = -1;
        let bc = -1;
        edges.forEach((e, i) => {
            if (e.ring !== r || used.has(i)) {
                return;
            }
            const c = grind(nodes[nodes[e.a].ring >= nodes[e.b].ring ? e.a : e.b]);
            if (c > bc) {
                bc = c;
                best = i;
            }
        });
        if (best >= 0) {
            used.add(best);
            edges[best].kind = kind;
            edges[best].val = val;
        }
    };
    for (let r = 3; r <= NET_RINGS; r += 3) {
        special(r, 'mult', NET_MULTS[r / 3 - 1]);
    }
    NET_EXTRA_RINGS.forEach(r => special(r, 'extra', 1));
    NET_CHAIN_RINGS.forEach(r => special(r, 'chain', 1));
    NET_SLOT_RINGS.forEach(r => special(r, 'slot', 1));
    edges.forEach((e, i) => {
        if (used.has(i)) {
            return;
        }
        const x = rnd();
        e.kind = x < 0.45 ? 'luck' : x < 0.7 ? 'auto' : x < 0.8 ? 'price' : x < 0.88 ? 'refresh' : 'stock';
    });
    ['luck', 'auto', 'price', 'refresh', 'stock'].forEach(kind => {
        const list = edges.filter(e => e.kind === kind);
        const wsum = list.reduce((s, e) => s + Math.pow(e.ring, NET_WEIGHT[kind]), 0);
        const dp = kind === 'auto' ? 10 : 100;
        list.forEach(e => e.val = Math.max(1 / dp, Math.round(NET_TOTALS[kind] * Math.pow(e.ring, NET_WEIGHT[kind]) / wsum * dp) / dp));
    });
    const base = nodes.length;
    genOuter(nodes, edges, reqFor);
    // the easy bridge: cheapest rim slot to the nearest outer slot, which only asks for oxygen
    const from = nodes.slice(0, base).filter(n => n.ring === NET_RINGS && n.req.t === 'el').reduce((b, n) => grind(n) < grind(b) ? n : b);
    const to = nodes.slice(base).filter(n => n.orbit === 0).reduce((b, n) => Math.hypot(n.x - from.x, n.y - from.y) < Math.hypot(b.x - from.x, b.y - from.y) ? n : b);
    to.req = { t: 'el', k: 'O', n: 1000 };
    edges.push({ a: from.id, b: to.id, ring: NET_RINGS + 2, orbit: 0, kind: 'drop', val: 0.5 });
    const adj = nodes.map(() => []);
    edges.forEach((e, i) => {
        adj[e.a].push(i);
        adj[e.b].push(i);
    });
    return { nodes, edges, adj, base };
}
// expected rolls to get a slot's full amount at a given luck and chain chance
const shareMemo = {};
function rollsFor(q, luck, denom) {
    let share = shareMemo[luck];
    if (!share) {
        share = shareMemo[luck] = {};
        let tot = 0;
        ELEMENTS.forEach(e => {
            share[e[0]] = Math.pow(1 + 1.5 * (Math.log10(e[2] + 1) / 3), (luck / 100) / 1.5) / e[2];
            tot += share[e[0]];
        });
        Object.keys(share).forEach(k => share[k] /= tot);
    }
    const go = 1 / denom;
    let p;
    if (q.t === 'el') {
        p = share[q.k] * (1 - go);
    } else if (q.t === 'fam') {
        p = ELEMENTS.filter(e => familyOf(e[0]) === q.k).reduce((s, e) => s + share[e[0]], 0) * (1 - go);
    } else if (q.t === 'has') {
        p = share[q.k] * go * 2;
    } else {
        const counts = parseFormula(q.l);
        const m = Object.values(counts).reduce((a, c) => a + c, 0);
        const fact = k => k < 2 ? 1 : k * fact(k - 1);
        p = Math.pow(go, m - 1) * (1 - go) * fact(m);
        Object.keys(counts).forEach(k => p *= Math.pow(share[k], counts[k]) / fact(counts[k]));
    }
    return q.n / p;
}
function genOuter(nodes, edges, reqFor) {
    const R = seededRnd(OUTER_SEED);
    const base = nodes.length;
    const nearest = (list, n) => list.reduce((b, m) => Math.hypot(m.x - n.x, m.y - n.y) < Math.hypot(b.x - n.x, b.y - n.y) ? m : b, list[0]);
    const orbits = [];
    for (let o = 0; o < OUTER_ORBITS; o++) {
        const ring = NET_RINGS + 2 + o;
        const rad = OUTER_RADIUS + o * OUTER_STEP;
        const off = R() * Math.PI * 2;
        const list = [];
        for (let i = 0; i < OUTER_PER_ORBIT; i++) {
            const a = off + (i + (R() - 0.5) * 0.4) / OUTER_PER_ORBIT * Math.PI * 2;
            const r = rad + (R() - 0.5) * 36;
            const n = { id: nodes.length, x: Math.cos(a) * r, y: Math.sin(a) * r, ring, ang: a, orbit: o };
            nodes.push(n);
            list.push(n);
        }
        // close each orbit and link it to the one inside
        list.forEach((n, i) => edges.push({ a: n.id, b: list[(i + 1) % list.length].id, ring, orbit: o }));
        if (o) {
            list.forEach((n, i) => {
                if (R() < 0.3 || i % 40 === 0) {
                    edges.push({ a: nearest(orbits[o - 1], n).id, b: n.id, ring, orbit: o, join: true });
                }
            });
        }
        orbits.push(list);
    }
    // bridges
    const edge = nodes.slice(0, base).filter(n => n.ring >= NET_RINGS - 2);
    const bridges = [];
    for (let k = 0; k < OUTER_BRIDGES; k++) {
        const at = (k + 0.5) / OUTER_BRIDGES * Math.PI * 2;
        const near = edge.filter(n => Math.abs(Math.atan2(Math.sin(Math.atan2(n.y, n.x) - at), Math.cos(Math.atan2(n.y, n.x) - at))) < 0.35);
        const from = (near.length ? near : edge).reduce((b, n) => Math.hypot(n.x, n.y) > Math.hypot(b.x, b.y) ? n : b);
        const e = { a: from.id, b: nearest(orbits[0], from).id, ring: NET_RINGS + 2, orbit: 0, bridge: true };
        edges.push(e);
        bridges.push(e);
    }
    for (let i = base; i < nodes.length; i++) {
        nodes[i].req = reqFor(nodes[i].ring, R);
        // late luck makes some of these near impossible, so ask for the rarest element instead
        const q = nodes[i].req;
        if (q.t === 'cp' && rollsFor(q, 700, 3) > 3e5) {
            const els = ELEMENTS.filter(e => parseFormula(q.l)[e[0]]);
            nodes[i].req = { t: 'has', k: els.reduce((a, b) => b[2] > a[2] ? b : a)[0], n: 10 };
        }
    }
    const taken = new Set();
    BRIDGE_ORDER.forEach((k, i) => {
        const e = bridges[k];
        const [kind, cos, [sym, n]] = BRIDGE_UNLOCKS[i];
        e.kind = kind;
        e.val = cos || 1;
        nodes[e.b].req = { t: 'el', k: sym, n };
        taken.add(e);
    });
    const hard = n => rollsFor(n.req, 700, 3);
    // cosmetics go on the hardest line in their orbit
    const outerEdges = edges.filter(e => e.orbit != null);
    OUTER_UNLOCKS.forEach(([o, cos]) => {
        let best = null;
        let bc = -1;
        outerEdges.forEach(e => {
            if (e.orbit !== o || e.bridge || taken.has(e)) {
                return;
            }
            const c = Math.max(hard(nodes[e.a]), hard(nodes[e.b]));
            if (c > bc) {
                bc = c;
                best = e;
            }
        });
        taken.add(best);
        best.kind = 'cos';
        best.val = cos;
    });
    const free = outerEdges.filter(e => !taken.has(e));
    free.forEach(e => {
        let x = R();
        e.kind = OUTER_SHARE.find(([, p]) => (x -= p) < 0)[0];
    });
    Object.keys(OUTER_TOTALS).forEach(kind => {
        const list = free.filter(e => e.kind === kind);
        const wsum = list.reduce((s, e) => s + Math.pow(e.orbit + 1, 1.5), 0);
        list.forEach(e => e.val = Math.max(0.01, Math.round(OUTER_TOTALS[kind] * Math.pow(e.orbit + 1, 1.5) / wsum * 100) / 100));
    });
}
function net() {
    return NET || (NET = genNetwork());
}
const netFilled = id => !!netState[id];
// outer ring stays off the map until one of its slots can be reached
let outerMemo = null;
function outerShown() {
    if (!outerMemo || outerMemo.v !== netVer) {
        const N = net();
        outerMemo = { v: netVer, on: N.nodes.slice(N.base).some(n => netFilled(n.id) || netReachable(n.id)) };
    }
    return outerMemo.on;
}
function shownNet() {
    const N = net();
    if (outerShown()) {
        return N;
    }
    return N.inner || (N.inner = { nodes: N.nodes.slice(0, N.base), edges: N.edges.filter(e => e.orbit == null), adj: N.adj });
}
const NET_BIG = new Set(['mult', 'slot', 'chain', 'ion', 'joke', 'hold', 'jokecat', 'cos', 'drop']);
const edgeLit = e => netFilled(e.a) && netFilled(e.b);
function edgeDesc(e) {
    const v = e.val;
    if (e.orbit != null && NET_BIG.has(e.kind) && !edgeLit(e)) {
        return '???';
    }
    const outer = {
        quark: `+${v}% quarks`, event: `+${v}% event chance`, cdur: `+${v}% catalyst time`, dup: `+${v}% duplicate catalysts`,
        refund: `+${v}% catalyst refunds`, storm: `+${v}% Quark Storm size`, hold: 'Shop hold', drop: 'Catalyst drops (1 in 200 rolls)',
        ion: 'Unlocks ionisation', joke: 'Unlocks the joke table', jokecat: jokesOn() ? 'Joke catalysts in the shop' : 'You have unlocked something…', cos: 'Unlocks ' + COSMETIC_NAMES[v]
    };
    return outer[e.kind] || (e.kind === 'luck' ? `+${v}% luck` : e.kind === 'mult' ? `×${v} luck` : e.kind === 'auto' ? `+${v}% autoroll speed` : e.kind === 'chain' ? 'Chain chance +1 step' : e.kind === 'extra' ? '+1 bonus roll' : e.kind === 'price' ? `−${v}% shop prices` : e.kind === 'refresh' ? `−${v} min shop restock` : e.kind === 'stock' ? `+${v}% rarer shop stock` : '+1 shop stock slot');
}
function reqShort(q) {
    if (q.t === 'el') {
        return (q.n > 1 ? q.n + ' ' : '') + q.k;
    }
    if (q.t === 'cp') {
        return q.l;
    }
    if (q.t === 'fam') {
        return (q.n > 1 ? q.n + '× ' : '') + FAMILY_ONE[q.k].split(' ')[0];
    }
    return q.k + '–?';
}
// collection records that can pay for a slot, most plentiful first
function eligible(q) {
    const avail = c => (c.count || 1) - (c.spent || 0);
    const single = c => c.elements && c.elements.length === 1;
    let list;
    if (q.t === 'el') {
        list = collection.filter(c => c.formula === q.k);
    } else if (q.t === 'cp') {
        list = collection.filter(c => normalizeFormula(c.formula) === q.k);
    } else if (q.t === 'fam') {
        list = collection.filter(c => single(c) && familyOf(c.elements[0][0]) === q.k);
    } else {
        list = collection.filter(c => c.elements && c.elements.length > 1 && c.elements.some(e => e[0] === q.k));
    }
    return list.map(c => ({ c, n: avail(c) })).filter(x => x.n > 0).sort((a, b) => b.n - a.n);
}
var netVer = 0;
const payMemo = new Map();
function canPay(q) {
    const m = payMemo.get(q);
    if (m && m.v === netVer) {
        return m.ok;
    }
    const ok = eligible(q).reduce((s, x) => s + x.n, 0) >= q.n;
    payMemo.set(q, { v: netVer, ok });
    return ok;
}
function payPlan(q) {
    let need = q.n;
    const plan = [];
    eligible(q).forEach(x => {
        if (need <= 0) {
            return;
        }
        const take = Math.min(need, x.n);
        plan.push({ c: x.c, take });
        need -= take;
    });
    return need > 0 ? null : plan;
}
const netReachable = id => id === 0 || net().adj[id].some(i => {
    const e = net().edges[i];
    return netFilled(e.a === id ? e.b : e.a);
});
const netFillable = id => !netFilled(id) && netReachable(id) && canPay(net().nodes[id].req);
// every slot you could fill right now, worked out once per change
let fillMemo = null;
function fillableIds() {
    if (fillMemo && fillMemo.v === netVer) {
        return fillMemo.ids;
    }
    const ids = net().nodes.filter(n => netFillable(n.id)).map(n => n.id);
    fillMemo = { v: netVer, ids };
    return ids;
}
function fillSlot(id) {
    const n = net().nodes[id];
    if (!netFillable(id)) {
        return false;
    }
    const plan = payPlan(n.req);
    plan.forEach(p => p.c.spent = (p.c.spent || 0) + p.take);
    save();
    fillFree(id);
    return true;
}
function fillFree(id) {
    netState[id] = 1;
    saveNet();
    netVer++;
    buffCache = weightCache = null;
    setTimeout(jokeIntroCheck, 600);
    applyCosmetics();
}
// quark pity: outer ring slots can be bought outright once 3 bridges are lit
let pityMemo = null;
function pityOn() {
    if (!pityMemo || pityMemo.v !== netVer) {
        pityMemo = { v: netVer, on: net().edges.filter(e => e.bridge && edgeLit(e)).length >= 3, price: new Map() };
    }
    return pityMemo.on;
}
function pityPrice(n) {
    pityOn();
    const key = n.id + ':' + collection.length;
    if (pityMemo.price.has(key)) {
        return pityMemo.price.get(key);
    }
    const b = activeBuffStats();
    const q = n.req;
    const left = Math.max(1, q.n - eligible(q).reduce((s, x) => s + x.n, 0));
    const rolls = rollsFor(q, Math.round(b.luck - catBonus().luck), b.chainDenom) * left / q.n;
    const price = Number(Math.min(2.5e7, Math.max(1e6, rolls * 0.5)).toPrecision(2));
    pityMemo.price.set(key, price);
    return price;
}
const pityReady = n => n.orbit != null && !netFilled(n.id) && netReachable(n.id) && !canPay(n.req) && pityOn() && quarks >= pityPrice(n);
function pityAsk(n) {
    const price = pityPrice(n);
    const w = openDialog('<h2>Use quarks for this slot?</h2><p>This will spend <b>' + formatNumber(price) + ' quarks</b> to fill the slot without its ' + esc(reqShort(n.req)) + '. It can\'t be undone.</p>' +
        '<div class="btn-row"><button class="primary" id="pityYes">Spend ' + formatNumber(price) + '</button><button class="ghost" id="pityNo">Cancel</button></div>');
    w.querySelector('#pityNo').onclick = closeDialog;
    w.querySelector('#pityYes').onclick = () => {
        closeDialog();
        if (!pityReady(n)) {
            return;
        }
        addQuarks(-price);
        fillFree(n.id);
        netFlash(n.id);
        bondSummary();
        $('netTotals').innerHTML = netTotalsHtml();
        renderRollStats();
        netDraw();
    };
}
// the open slot you're nearest to paying for (bonding agent)
function closestSlot() {
    let best = null;
    shownNet().nodes.forEach(n => {
        if (netFilled(n.id) || !netReachable(n.id)) {
            return;
        }
        const have = Math.min(1, eligible(n.req).reduce((s, x) => s + x.n, 0) / n.req.n);
        if (!best || have > best.have || (have === best.have && n.req.n < best.n.req.n)) {
            best = { n, have };
        }
    });
    return best && best.n;
}
// joke element bonuses, no luck or speed ones
const JOKE_BONUS = {
    Um: ['event', 25], Zz: ['away', 6], Mu: ['quark', 15], Ln: ['refund', 10], Df: ['cdur', 15], Cz: ['storm', 25], Mb: ['dup', 5], Dj: ['evlen', 25],
    Ha: ['price', 5], Ad: ['refresh', 2], Nu: ['alone', 50], Xx: ['secret', 5], Uo: ['jokerate', 100], Zo: ['cos', 'warp'], Gg: ['cos', 'gameover']
};
const jokeBonusText = sym => {
    const [k, v] = JOKE_BONUS[sym];
    return {
        event: `Events are ${v}% more likely`, away: `Away rolls cover ${v} more hours`, quark: `+${v}% quarks per roll`, refund: `${v}% chance a single-roll catalyst isn't used up`,
        cdur: `Catalysts last ${v}% longer`, storm: `Quark Storms pay ${v}% more`, dup: `${v}% chance a bought catalyst arrives as two`, evlen: `Events last ${v}% longer`,
        price: `Shop prices ${v}% lower`, refresh: `The shop restocks ${v} minutes sooner`, alone: `Rolls with no chain earn ${v}% more quarks`, secret: `Secret effects are ${v}% more likely`,
        jokerate: 'Joke catalysts appear twice as often in the shop', cos: v === 'warp' ? 'Unlocks the Warp scanner' : 'Unlocks the Game Over page and the Final Element badge'
    }[k];
};
// netBonus is lines only, bondBonus adds the jokes
let netCache = null;
function netBonus() {
    if (netCache && netCache.v === netVer) {
        return netCache.r;
    }
    const r = {
        add: 0, mult: 1, auto: 0, price: 0, refresh: 0, stock: 0, slots: 0, chain: 0, extra: 0,
        quark: 0, event: 0, cdur: 0, dup: 0, refund: 0, storm: 0, hold: false, ion: false, joke: false, jokecat: false, cos: [],
        away: 0, evlen: 0, alone: 0, secret: 0, jokerate: 0, drop: 0
    };
    net().edges.forEach(e => {
        if (!edgeLit(e)) {
            return;
        }
        if (e.kind === 'luck') {
            r.add += e.val;
        } else if (e.kind === 'mult') {
            r.mult *= e.val;
        } else if (e.kind === 'slot') {
            r.slots += 1;
        } else if (e.kind === 'cos') {
            r.cos.push(e.val);
        } else if (typeof r[e.kind] === 'boolean') {
            r[e.kind] = true;
        } else {
            r[e.kind] += e.val;
        }
    });
    netCache = { v: netVer, r };
    return r;
}
let bondCache = null;
function bondBonus() {
    const n = netBonus();
    const found = jokesFound();
    if (bondCache && bondCache.n === n && bondCache.j === found) {
        return bondCache.r;
    }
    const r = Object.assign({}, n, { cos: n.cos.slice() });
    found.forEach(s => {
        const [k, v] = JOKE_BONUS[s];
        if (k === 'cos') {
            r.cos.push(v);
        } else {
            r[k] += v;
        }
    });
    bondCache = { n, j: found, r };
    return r;
}
function bondSummary() {
    const N = shownNet().nodes.length;
    const f = Object.keys(netState).length;
    $('homeBonds').textContent = f + ' / ' + N + ' slots';
}
// the network view
const netView = { x: 0, y: 0, z: 1, anim: null };
let netCanvas = null;
let netSel = null;
let netRaf = 0;
function netResize() {
    const cv = netCanvas;
    if (!cv) {
        return;
    }
    const r = cv.getBoundingClientRect();
    const dpr = Math.min(2, devicePixelRatio || 1);
    cv.width = Math.round(r.width * dpr);
    cv.height = Math.round(r.height * dpr);
    netDraw();
}
function netToScreen(x, y) {
    const r = netCanvas.getBoundingClientRect();
    return [(x - netView.x) * netView.z + r.width / 2, (y - netView.y) * netView.z + r.height / 2];
}
function netToWorld(sx, sy) {
    const r = netCanvas.getBoundingClientRect();
    return [(sx - r.width / 2) / netView.z + netView.x, (sy - r.height / 2) / netView.z + netView.y];
}
function netDrawSoon() {
    if (!netRaf) {
        netRaf = requestAnimationFrame(() => {
            netRaf = 0;
            netDraw();
        });
    }
}
function netDraw() {
    const cv = netCanvas;
    if (!cv || !$('bonds').classList.contains('active')) {
        return;
    }
    const g = cv.getContext('2d');
    const dpr = cv.width / Math.max(1, cv.getBoundingClientRect().width);
    const W = cv.width / dpr;
    const H = cv.height / dpr;
    const { nodes, edges } = shownNet();
    const z = netView.z;
    const t = performance.now();
    const head = netDraw.font || (netDraw.font = getComputedStyle(document.body).getPropertyValue('--head'));
    const ringCol = r => NET_RING_COL[Math.min(NET_RING_COL.length - 1, r)];
    g.setTransform(dpr, 0, 0, dpr, 0, 0);
    g.clearRect(0, 0, W, H);
    // blueprint grid
    const step = 64 * z;
    if (step > 10) {
        g.strokeStyle = 'rgba(232,239,233,.05)';
        g.lineWidth = 1;
        const ox = ((-netView.x * z + W / 2) % step + step) % step;
        const oy = ((-netView.y * z + H / 2) % step + step) % step;
        g.beginPath();
        for (let x = ox; x < W; x += step) {
            g.moveTo(x, 0);
            g.lineTo(x, H);
        }
        for (let y = oy; y < H; y += step) {
            g.moveTo(0, y);
            g.lineTo(W, y);
        }
        g.stroke();
    }
    const S = (x, y) => [(x - netView.x) * z + W / 2, (y - netView.y) * z + H / 2];
    const pad = 60;
    const vis = (x, y) => x > -pad && x < W + pad && y > -pad && y < H + pad;
    const far = z < 0.45;
    if (z < 0.24) {
        const pic = netFarPicture(ringCol);
        const k = z / pic.s;
        g.imageSmoothingEnabled = true;
        g.drawImage(pic.cv, (pic.x0 - netView.x) * z + W / 2, (pic.y0 - netView.y) * z + H / 2, pic.cv.width / pic.r * k, pic.cv.height / pic.r * k);
        const pulse = 0.5 + 0.5 * Math.sin(t / 260);
        g.globalAlpha = 0.4 + 0.6 * pulse;
        g.strokeStyle = '#f0c419';
        g.lineWidth = 2;
        let any = false;
        fillableIds().forEach(id => {
            const [x, y] = S(nodes[id].x, nodes[id].y);
            g.beginPath();
            g.arc(x, y, 6, 0, Math.PI * 2);
            g.stroke();
            any = true;
        });
        g.globalAlpha = 1;
        $('netJump').hidden = true;
        if (any) {
            netDrawSoon();
        }
        return;
    }
    // lines: unlit ones batched into two paths, lit ones drawn with a glow
    const dashed = new Path2D();
    const solid = new Path2D();
    const lit = [];
    const labels = [];
    edges.forEach(e => {
        const A = nodes[e.a];
        const B = nodes[e.b];
        const [ax, ay] = S(A.x, A.y);
        const [bx, by] = S(B.x, B.y);
        if (Math.max(ax, bx) < -pad || Math.min(ax, bx) > W + pad || Math.max(ay, by) < -pad || Math.min(ay, by) > H + pad) {
            return;
        }
        const on = edgeLit(e);
        if (on) {
            lit.push([ax, ay, bx, by, ringCol(e.ring)]);
        } else {
            const p = NET_BIG.has(e.kind) || far ? solid : dashed;
            p.moveTo(ax, ay);
            p.lineTo(bx, by);
        }
        if (z > 0.8) {
            const relevant = on || netFilled(e.a) || netFilled(e.b) || NET_BIG.has(e.kind);
            const mx = (ax + bx) / 2;
            const my = (ay + by) / 2;
            if ((relevant || z > 1.6) && vis(mx, my)) {
                labels.push([mx, my, e, on]);
            }
        }
    });
    g.lineCap = 'round';
    g.strokeStyle = 'rgba(232,239,233,.22)';
    g.lineWidth = Math.max(1, 1.5 * z);
    g.stroke(solid);
    if (!far) {
        g.setLineDash([6 * z, 5 * z]);
        g.stroke(dashed);
        g.setLineDash([]);
    }
    lit.forEach(([ax, ay, bx, by, col]) => {
        g.strokeStyle = col;
        g.globalAlpha = 0.35;
        g.lineWidth = Math.max(3, 10 * z);
        g.beginPath();
        g.moveTo(ax, ay);
        g.lineTo(bx, by);
        g.stroke();
        g.globalAlpha = 1;
        g.lineWidth = Math.max(1.5, 3.2 * z);
        g.stroke();
    });
    if (labels.length) {
        const k = Math.min(1.4, z);
        g.font = '600 ' + Math.round(10.5 * k) + 'px ' + head;
        g.textAlign = 'center';
        g.textBaseline = 'middle';
        labels.forEach(([mx, my, e, on]) => {
            const txt = edgeDesc(e);
            const w = g.measureText(txt).width + 10;
            g.fillStyle = 'rgba(10,16,14,.85)';
            g.fillRect(mx - w / 2, my - 9 * k, w, 18 * k);
            g.fillStyle = on ? ringCol(e.ring) : NET_BIG.has(e.kind) ? '#f0c419' : 'rgba(232,239,233,.55)';
            g.fillText(txt, mx, my + 0.5);
        });
    }
    // slots
    const R = 24 * z;
    const pulse = 0.5 + 0.5 * Math.sin(t / 260);
    let anyAvail = false;
    if (far) {
        // zoomed out: plain dots, batched by colour
        const groups = new Map();
        const ring = new Path2D();
        const red = new Path2D();
        const rr = Math.max(2, R);
        nodes.forEach(n => {
            const [x, y] = S(n.x, n.y);
            if (!vis(x, y)) {
                return;
            }
            const filled = netFilled(n.id);
            const avail = !filled && netReachable(n.id) && canPay(n.req);
            anyAvail = anyAvail || avail;
            const key = filled ? ringCol(n.ring) : 'rgba(232,239,233,.35)';
            if (!groups.has(key)) {
                groups.set(key, new Path2D());
            }
            const p = groups.get(key);
            p.moveTo(x + rr, y);
            p.arc(x, y, rr, 0, Math.PI * 2);
            if (avail || pityReady(n)) {
                const p2 = avail ? ring : red;
                p2.moveTo(x + rr + 4, y);
                p2.arc(x, y, rr + 4, 0, Math.PI * 2);
            }
        });
        groups.forEach((p, col) => {
            g.fillStyle = col;
            g.fill(p);
        });
        g.globalAlpha = 0.4 + 0.6 * pulse;
        g.strokeStyle = '#f0c419';
        g.lineWidth = 2;
        g.stroke(ring);
        g.strokeStyle = '#ff5a4a';
        g.stroke(red);
        g.globalAlpha = 1;
    } else {
        nodes.forEach(n => {
            const [x, y] = S(n.x, n.y);
            if (!vis(x, y)) {
                return;
            }
            const filled = netFilled(n.id);
            const reach = netReachable(n.id);
            const avail = !filled && reach && canPay(n.req);
            const pity = !avail && pityReady(n);
            const col = ringCol(n.ring);
            anyAvail = anyAvail || avail || pity;
            g.globalAlpha = filled || reach ? 1 : 0.35;
            const hex = n.req.t === 'cp' || n.req.t === 'has';
            slotPath(g, x, y, R, hex);
            g.fillStyle = filled ? col : '#0d1311';
            g.fill();
            g.lineWidth = Math.max(1.2, (filled ? 2.5 : 1.6) * z);
            g.strokeStyle = filled ? col : avail ? '#f0c419' : pity ? '#ff5a4a' : 'rgba(232,239,233,.4)';
            g.stroke();
            if (avail || pity) {
                g.globalAlpha = 0.3 + 0.5 * pulse;
                slotPath(g, x, y, R + (5 + 5 * pulse) * z, hex);
                g.strokeStyle = avail ? '#f0c419' : '#ff5a4a';
                g.lineWidth = Math.max(1, 2 * z);
                g.stroke();
            }
            if (netSel === n.id) {
                g.globalAlpha = 1;
                slotPath(g, x, y, R + 4 * z, hex);
                g.strokeStyle = '#fff';
                g.lineWidth = 2;
                g.stroke();
            }
            g.globalAlpha = filled || reach ? 1 : 0.45;
            if (z > 0.38) {
                const label = filled && n.req.t === 'el' && n.req.n === 1 ? n.req.k : reqShort(n.req);
                let fs = 13 * z;
                g.font = '700 ' + fs + 'px ' + head;
                const w = g.measureText(label).width;
                if (w > R * 1.75) {
                    fs *= R * 1.75 / w;
                    g.font = '700 ' + fs + 'px ' + head;
                }
                g.fillStyle = filled ? '#0d1311' : '#e8efe9';
                g.textAlign = 'center';
                g.textBaseline = 'middle';
                g.fillText(label, x, y + 1);
            }
            g.globalAlpha = 1;
        });
    }
    // arrows at the edge pointing to fillable slots off screen
    const off = [];
    fillableIds().forEach(id => {
        const [x, y] = S(nodes[id].x, nodes[id].y);
        if (x < 0 || x > W || y < 0 || y > H) {
            off.push([x, y, Math.hypot(x - W / 2, y - H / 2)]);
        }
    });
    off.sort((a, b) => a[2] - b[2]);
    off.slice(0, 8).forEach(([x, y]) => {
        const a = Math.atan2(y - H / 2, x - W / 2);
        const m = 26;
        const kx = (W / 2 - m) / Math.abs(Math.cos(a) || 1e-6);
        const ky = (H / 2 - m) / Math.abs(Math.sin(a) || 1e-6);
        const d = Math.min(kx, ky);
        g.save();
        g.translate(W / 2 + Math.cos(a) * d, H / 2 + Math.sin(a) * d);
        g.rotate(a);
        g.globalAlpha = 0.55 + 0.45 * pulse;
        g.fillStyle = '#f0c419';
        g.beginPath();
        g.moveTo(12, 0);
        g.lineTo(-8, -9);
        g.lineTo(-3, 0);
        g.lineTo(-8, 9);
        g.closePath();
        g.fill();
        g.restore();
    });
    const jb = $('netJump');
    if (jb) {
        jb.hidden = !(off.length && !anyAvail);
    }
    // keep animating only while something on screen pulses
    if (anyAvail || off.length) {
        netDrawSoon();
    }
}
let netFarPic = null;
function netFarPicture(ringCol) {
    const key = netVer + ':' + Object.keys(netState).length + ':' + outerShown();
    if (netFarPic && netFarPic.key === key) {
        return netFarPic;
    }
    const { nodes, edges } = shownNet();
    const s = 0.24;
    const r = Math.min(2, devicePixelRatio || 1);
    let x0 = Infinity;
    let y0 = Infinity;
    let x1 = -Infinity;
    let y1 = -Infinity;
    nodes.forEach(n => {
        x0 = Math.min(x0, n.x);
        y0 = Math.min(y0, n.y);
        x1 = Math.max(x1, n.x);
        y1 = Math.max(y1, n.y);
    });
    x0 -= 60;
    y0 -= 60;
    x1 += 60;
    y1 += 60;
    const cv = document.createElement('canvas');
    cv.width = Math.ceil((x1 - x0) * s * r);
    cv.height = Math.ceil((y1 - y0) * s * r);
    const g = cv.getContext('2d');
    g.scale(r, r);
    const P = (x, y) => [(x - x0) * s, (y - y0) * s];
    const dim = new Path2D();
    edges.forEach(e => {
        if (edgeLit(e)) {
            return;
        }
        const [ax, ay] = P(nodes[e.a].x, nodes[e.a].y);
        const [bx, by] = P(nodes[e.b].x, nodes[e.b].y);
        dim.moveTo(ax, ay);
        dim.lineTo(bx, by);
    });
    g.strokeStyle = 'rgba(232,239,233,.22)';
    g.lineWidth = 1;
    g.stroke(dim);
    g.lineCap = 'round';
    edges.forEach(e => {
        if (!edgeLit(e)) {
            return;
        }
        const [ax, ay] = P(nodes[e.a].x, nodes[e.a].y);
        const [bx, by] = P(nodes[e.b].x, nodes[e.b].y);
        g.strokeStyle = ringCol(e.ring);
        g.lineWidth = 2.5;
        g.beginPath();
        g.moveTo(ax, ay);
        g.lineTo(bx, by);
        g.stroke();
    });
    const groups = new Map();
    nodes.forEach(n => {
        const key2 = netFilled(n.id) ? ringCol(n.ring) : 'rgba(232,239,233,.35)';
        if (!groups.has(key2)) {
            groups.set(key2, new Path2D());
        }
        const [x, y] = P(n.x, n.y);
        const p = groups.get(key2);
        p.moveTo(x + 3, y);
        p.arc(x, y, 3, 0, Math.PI * 2);
    });
    groups.forEach((p, col) => {
        g.fillStyle = col;
        g.fill(p);
    });
    return netFarPic = { key, cv, s, r, x0, y0 };
}
function slotPath(g, x, y, r, hex) {
    g.beginPath();
    if (!hex) {
        g.arc(x, y, r, 0, Math.PI * 2);
        return;
    }
    for (let i = 0; i < 6; i++) {
        const a = Math.PI / 6 + i * Math.PI / 3;
        const px = x + Math.cos(a) * r * 1.08;
        const py = y + Math.sin(a) * r * 1.08;
        if (i) {
            g.lineTo(px, py);
        } else {
            g.moveTo(px, py);
        }
    }
    g.closePath();
}
function netGlideTo(x, y, z) {
    const from = { x: netView.x, y: netView.y, z: netView.z };
    const to = { x, y, z: z || Math.max(0.9, netView.z) };
    const t0 = performance.now();
    const d = 800;
    netView.anim = true;
    (function f(now) {
        const k = Math.min(1, (now - t0) / d);
        const e = k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2;
        // pull back a little mid-flight so long jumps read as travel
        const dip = Math.sin(Math.PI * k) * Math.min(0.45, Math.hypot(to.x - from.x, to.y - from.y) / 3000);
        netView.x = from.x + (to.x - from.x) * e;
        netView.y = from.y + (to.y - from.y) * e;
        netView.z = (from.z + (to.z - from.z) * e) * (1 - dip);
        netDraw();
        if (k < 1) {
            requestAnimationFrame(f);
        } else {
            netView.anim = null;
            netDraw();
        }
    })(t0);
}
function netJump() {
    const { nodes } = shownNet();
    let best = null;
    fillableIds().map(id => nodes[id]).forEach(n => {
        const d = Math.hypot(n.x - netView.x, n.y - netView.y);
        if (!best || d < best.d) {
            best = { n, d };
        }
    });
    if (best) {
        netGlideTo(best.n.x, best.n.y, 1.1);
    }
}
function netTotalsHtml() {
    const b = netBonus();
    const rows = [['Luck', '+' + b.add.toFixed(2) + '%'], ['Luck multiplier', '×' + b.mult.toFixed(3)], ['Autoroll speed', '+' + b.auto.toFixed(1) + '%'], ['Shop prices', '−' + b.price.toFixed(2) + '%'], ['Shop restock', '−' + b.refresh.toFixed(2) + ' min'], ['Rarer shop stock', '+' + b.stock.toFixed(2) + '%'], ['Shop stock slots', '+' + b.slots], ['Bonus rolls', '+' + b.extra], ['Chain steps', '+' + b.chain]];
    [['Quarks per roll', b.quark, '%'], ['Event chance', b.event, '%'], ['Catalyst duration', b.cdur, '%'], ['Duplicate catalysts', b.dup, '% chance'],
        ['Single-roll catalysts kept', b.refund, '% chance'], ['Bigger Quark Storms', b.storm, '%']].forEach(([k, v, u]) => {
        if (v) {
            rows.push([k, '+' + v.toFixed(2) + u]);
        }
    });
    [['Shop hold', b.hold], ['Ionisation', b.ion], ['Joke periodic table', b.joke], ['Joke catalysts', b.jokecat && b.joke]].forEach(([k, on]) => {
        if (on) {
            rows.push([k, 'Unlocked']);
        }
    });
    if (b.cos.length) {
        rows.push(['Cosmetics unlocked', b.cos.length]);
    }
    if (b.drop) {
        rows.push(['Catalyst drops', '1 in ' + Math.round(100 / b.drop) + ' rolls']);
    }
    return rows.map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join('');
}
// tapping a slot fills it straight away when you can; otherwise the slot flashes red
function netSelect(id) {
    netSel = null;
    if (id == null) {
        netDraw();
        return;
    }
    if (fillSlot(id)) {
        netFlash(id);
        bondSummary();
        $('netTotals').innerHTML = netTotalsHtml();
        renderRollStats();
    } else if (pityReady(net().nodes[id])) {
        pityAsk(net().nodes[id]);
    } else if (!netFilled(id)) {
        netFlash(id, '#ff5a4a');
    }
    netDraw();
}
function netFlash(id, colour) {
    const n = net().nodes[id];
    const fx = $('netFx');
    const [x, y] = netToScreen(n.x, n.y);
    const e = document.createElement('i');
    e.style.left = x + 'px';
    e.style.top = y + 'px';
    e.style.setProperty('--c', colour || NET_RING_COL[Math.min(NET_RING_COL.length - 1, n.ring)]);
    if (colour) {
        e.className = 'deny';
    }
    fx.appendChild(e);
    setTimeout(() => e.remove(), 900);
}
function renderBonds() {
    netCanvas = $('netCanvas');
    bondSummary();
    $('netTotals').innerHTML = netTotalsHtml();
    if (!netView.init) {
        netView.init = true;
        netView.x = 0;
        netView.y = 0;
        netView.z = innerWidth < 600 ? 0.8 : 1;
    }
    netSelect(null);
    netResize();
}
{
    const cv = $('netCanvas');
    const pts = new Map();
    let drag = null;
    let pinch = null;
    let moved = false;
    const zoomAt = (sx, sy, f) => {
        const [wx, wy] = netToWorld(sx, sy);
        netView.z = Math.max(0.05, Math.min(2.6, netView.z * f));
        const r = cv.getBoundingClientRect();
        netView.x = wx - (sx - r.width / 2) / netView.z;
        netView.y = wy - (sy - r.height / 2) / netView.z;
        netDrawSoon();
    };
    const local = e => {
        const r = cv.getBoundingClientRect();
        return [e.clientX - r.left, e.clientY - r.top];
    };
    cv.addEventListener('pointerdown', e => {
        cv.setPointerCapture(e.pointerId);
        pts.set(e.pointerId, local(e));
        moved = false;
        if (pts.size === 1) {
            drag = { p: local(e), x: netView.x, y: netView.y };
        } else if (pts.size === 2) {
            const [a, b] = [...pts.values()];
            pinch = { d: Math.hypot(a[0] - b[0], a[1] - b[1]), z: netView.z, m: [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2] };
            drag = null;
        }
    });
    cv.addEventListener('pointermove', e => {
        if (!pts.has(e.pointerId)) {
            return;
        }
        pts.set(e.pointerId, local(e));
        if (pinch && pts.size >= 2) {
            const [a, b] = [...pts.values()];
            const d = Math.hypot(a[0] - b[0], a[1] - b[1]);
            const m = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
            const [wx, wy] = netToWorld(pinch.m[0], pinch.m[1]);
            netView.z = Math.max(0.05, Math.min(2.6, pinch.z * d / pinch.d));
            const r = cv.getBoundingClientRect();
            netView.x = wx - (m[0] - r.width / 2) / netView.z;
            netView.y = wy - (m[1] - r.height / 2) / netView.z;
            pinch.m = m;
            pinch.z = netView.z;
            pinch.d = d;
            moved = true;
            netDrawSoon();
        } else if (drag) {
            const p = local(e);
            const dx = p[0] - drag.p[0];
            const dy = p[1] - drag.p[1];
            if (Math.hypot(dx, dy) > 6) {
                moved = true;
            }
            netView.x = drag.x - dx / netView.z;
            netView.y = drag.y - dy / netView.z;
            netDrawSoon();
        }
    });
    const up = e => {
        if (!pts.has(e.pointerId)) {
            return;
        }
        const p = local(e);
        pts.delete(e.pointerId);
        if (pts.size < 2) {
            pinch = null;
        }
        if (pts.size === 1) {
            const q = [...pts.values()][0];
            drag = { p: q, x: netView.x, y: netView.y };
            return;
        }
        drag = null;
        if (!moved && e.type === 'pointerup') {
            const [wx, wy] = netToWorld(p[0], p[1]);
            let hit = null;
            shownNet().nodes.forEach(n => {
                const d = Math.hypot(n.x - wx, n.y - wy);
                if (d < 30 / Math.min(1, netView.z) && (!hit || d < hit.d)) {
                    hit = { n, d };
                }
            });
            netSelect(hit ? hit.n.id : null);
        }
    };
    cv.addEventListener('pointerup', up);
    cv.addEventListener('pointercancel', up);
    cv.addEventListener('wheel', e => {
        e.preventDefault();
        const [sx, sy] = local(e);
        zoomAt(sx, sy, Math.exp(-e.deltaY * (e.ctrlKey ? 0.01 : 0.0015)));
    }, { passive: false });
    addEventListener('resize', () => {
        if ($('bonds').classList.contains('active')) {
            netResize();
        }
    });
    $('netJump').onclick = netJump;
    $('netCentre').onclick = () => netGlideTo(0, 0, innerWidth < 600 ? 0.8 : 1);
    $('netTotalsBtn').onclick = () => $('netTotalsWrap').classList.toggle('open');
}
// Catalyst shop
const CAT_TIERS = [
    { name: 'Common', col: '#9fb0a8', p: 60 },
    { name: 'Uncommon', col: '#6fcf8a', p: 26 },
    { name: 'Rare', col: '#5aa8ff', p: 9.5 },
    { name: 'Epic', col: '#b48cff', p: 3.2 },
    { name: 'Legendary', col: '#f0c419', p: 1 },
    { name: 'Mythic', col: '#ff6b8a', p: 0.25 },
    { name: 'Secret', col: '#ffffff', p: 0.05 }
];
const CATALYSTS = [
    { id: 'alkali', name: 'Alkali Metals Catalyst', tier: 0, min: 10, fx: { fam: 'alkali', pct: 150 }, price: 8 },
    { id: 'alkaline', name: 'Alkaline Earth Catalyst', tier: 0, min: 10, fx: { fam: 'alkaline', pct: 150 }, price: 8 },
    { id: 'halogen', name: 'Halogen Catalyst', tier: 0, min: 10, fx: { fam: 'halogen', pct: 150 }, price: 8 },
    { id: 'noble', name: 'Noble Gas Catalyst', tier: 0, min: 10, fx: { fam: 'noble', pct: 150 }, price: 10 },
    { id: 'nonmetal', name: 'Nonmetal Catalyst', tier: 0, min: 10, fx: { fam: 'nonmetal', pct: 150 }, price: 7 },
    { id: 'spark', name: 'Spark', tier: 0, min: 10, fx: { luck: 25 }, price: 13 },
    { id: 'trickle', name: 'Quark Trickle', tier: 0, min: 15, fx: { quark: 25 }, price: 10 },
    { id: 'transition', name: 'Transition Metals Catalyst', tier: 1, min: 15, fx: { fam: 'transition', pct: 200 }, price: 40 },
    { id: 'metalloid', name: 'Metalloid Catalyst', tier: 1, min: 15, fx: { fam: 'metalloid', pct: 200 }, price: 35 },
    { id: 'post', name: 'Post-transition Catalyst', tier: 1, min: 15, fx: { fam: 'post', pct: 200 }, price: 35 },
    { id: 'kindling', name: 'Kindling', tier: 1, min: 15, fx: { luck: 60 }, price: 60 },
    { id: 'accelerant', name: 'Accelerant', tier: 1, min: 15, fx: { speed: 25 }, price: 30 },
    { id: 'primer', name: 'Chain Primer', tier: 1, min: 15, fx: { chain: 1 }, price: 50 },
    { id: 'lanth', name: 'Lanthanide Catalyst', tier: 2, min: 20, fx: { fam: 'lanth', pct: 300 }, price: 170 },
    { id: 'actin', name: 'Actinide Catalyst', tier: 2, min: 20, fx: { fam: 'actin', pct: 300 }, price: 270 },
    { id: 'ignition', name: 'Ignition', tier: 2, min: 20, fx: { luck: 150 }, price: 230 },
    { id: 'linked', name: 'Linked Reaction', tier: 2, rolls: 10, fx: { linked: true }, price: 130 },
    { id: 'surge', name: 'Quark Surge', tier: 2, min: 20, fx: { quark: 100 }, price: 300 },
    { id: 'superheavy', name: 'Superheavy Catalyst', tier: 3, min: 30, fx: { fam: 'unknown', pct: 400 }, price: 800 },
    { id: 'blaze', name: 'Blaze', tier: 3, min: 30, fx: { luck: 300 }, price: 1200 },
    { id: 'twin', name: 'Twin Reactor', tier: 3, min: 30, fx: { extra: 1 }, price: 1000 },
    { id: 'lens', name: 'Precision Lens', tier: 3, rolls: 1, fx: { rollLuck: 800 }, price: 600 },
    { id: 'inferno', name: 'Inferno', tier: 4, min: 60, fx: { luck: 500 }, price: 6200 },
    { id: 'storm', name: 'Chain Storm', tier: 4, min: 30, fx: { chainMax: true }, price: 3100 },
    { id: 'engine', name: 'Quark Engine', tier: 4, min: 60, fx: { quark: 400 }, price: 15000 },
    { id: 'prism', name: 'Focus Prism', tier: 4, rolls: 1, fx: { rollLuck: 1500 }, price: 5000 },
    { id: 'fusion', name: 'Fusion Core', tier: 5, min: 30, fx: { luck: 600 }, price: 18000 },
    { id: 'horizon', name: 'Event Horizon', tier: 5, rolls: 1, fx: { rollLuck: 3000 }, price: 13000 },
    { id: 'singularity', name: 'Singularity', tier: 6, rolls: 1, fx: { rollLuck: 10000 }, price: 33000 },
    { id: 'stone', name: "Philosopher's Stone", tier: 6, rolls: 1, fx: { unfound: true }, price: 27000 },
    // instant = used on the spot, takes no slot
    { id: 'barometer', name: 'Barometer', tier: 0, min: 15, fx: { event: 50 }, price: 12 },
    { id: 'courier', name: 'Courier', tier: 0, instant: true, fx: { restock: true }, price: 10 },
    { id: 'qlens', name: 'Quark Lens', tier: 0, min: 15, fx: { lens: 50 }, price: 10 },
    { id: 'stabiliser', name: 'Stabiliser', tier: 1, instant: true, fx: { extend: 10 }, price: 40 },
    { id: 'rod', name: 'Lightning Rod', tier: 1, instant: true, fx: { rod: true }, price: 45 },
    { id: 'magnet', name: 'Family Magnet', tier: 1, rolls: 20, fx: { magnet: true }, price: 35 },
    { id: 'leveller', name: 'Leveller', tier: 1, min: 15, fx: { level: true }, price: 45 },
    { id: 'reagent', name: 'Practical Reagent', tier: 1, min: 15, joke: true, fx: { joke: 100 }, price: 50 },
    { id: 'grant', name: 'Grant Funding', tier: 2, instant: true, fx: { grant: true }, price: 200 },
    { id: 'heavy', name: 'Heavy Water', tier: 2, min: 20, fx: { heavy: 25 }, price: 230 },
    { id: 'punchline', name: 'Punchline', tier: 2, min: 15, joke: true, fx: { joke: 300 }, price: 270 },
    { id: 'accel', name: 'Particle Accelerator', tier: 3, rolls: 25, fx: { chain3: true }, price: 900 },
    { id: 'bondagent', name: 'Bonding Agent', tier: 3, instant: true, fx: { bond: true }, price: 2500 },
    { id: 'logger', name: 'Event Logger', tier: 3, instant: true, fx: { logger: true }, price: 1000 },
    { id: 'laugh', name: 'Laugh Track', tier: 3, min: 30, joke: true, fx: { laugh: true }, price: 800 },
    { id: 'stormseed', name: 'Storm Seed', tier: 4, instant: true, fx: { start: 'storm' }, price: 5000 },
    { id: 'colliderkey', name: 'Collider Key', tier: 4, instant: true, fx: { start: 'collider' }, price: 6200 },
    { id: 'gag', name: 'Running Gag', tier: 4, min: 30, joke: true, fx: { gag: true }, price: 4000 },
    { id: 'twinhorizon', name: 'Twin Horizon', tier: 5, rolls: 5, fx: { twice: true }, price: 16000 },
    { id: 'containment', name: 'Containment Field', tier: 5, instant: true, fx: { extend: 30 }, price: 14000 },
    { id: 'singseed', name: 'Singularity Seed', tier: 6, instant: true, fx: { start: 'hole' }, price: 30000 },
    { id: 'insidejoke', name: 'Inside Joke', tier: 6, rolls: 1, joke: true, fx: { jokeNew: true }, price: 30000 }
];
const CAT = Object.fromEntries(CATALYSTS.map(c => [c.id, c]));
function catEffect(c) {
    const f = c.fx;
    if (f.fam) {
        return `+${f.pct}% chance to roll ${FAMILY_ONE[f.fam] === 'superheavy' ? 'a superheavy (Mt to Lv)' : (/^[aeiou]/.test(FAMILY_ONE[f.fam]) ? 'an ' : 'a ') + FAMILY_ONE[f.fam]}`;
    }
    if (f.luck) {
        return `+${f.luck}% luck`;
    }
    if (f.quark) {
        return f.quark === 100 ? 'Double quarks earned' : f.quark === 400 ? 'Five times the quarks earned' : `+${f.quark}% quarks earned`;
    }
    if (f.speed) {
        return `+${f.speed}% scanner speed`;
    }
    if (f.chain) {
        return 'Chain chance one step better (1 in 8 to 1 in 7 at base, never past 1 in 3)';
    }
    if (f.chainMax) {
        return 'Chain chance at its maximum, 1 in 3';
    }
    if (f.extra) {
        return '+1 bonus roll on every roll, up to the maximum of 3';
    }
    if (f.linked) {
        return 'Each roll chains at least once';
    }
    if (f.rollLuck) {
        return `+${f.rollLuck.toLocaleString('en-US')}% luck` + (f.rollLuck >= 10000 ? ', which guarantees Uranium' : '');
    }
    const more = {
        event: `Events are ${f.event}% more likely to start`, restock: 'Restocks the shop straight away', lens: `+${f.lens}% quarks from rolls that chain`,
        extend: `Adds ${f.extend} minutes to every active timed catalyst`, rod: 'The next Quark Storm lasts 50% longer', magnet: "Chained elements come from the first element's family",
        joke: `+${f.joke}% chance of joke elements`, grant: 'Your next catalyst purchase costs half', heavy: `Each chained element adds +${f.heavy}% quarks`,
        chain3: 'Chain chance at its best (1 in 3)', logger: 'The next event lasts twice as long', laugh: 'Finds containing a joke element earn three times the quarks',
        start: 'Starts a ' + (f.start === 'storm' ? 'Quark Storm' : f.start === 'collider' ? 'Supercollider' : 'Black Hole') + ' now (not while another event is running)',
        gag: 'Joke elements are five times as likely, and ten times once you roll one while it lasts', twice: 'Each roll is rolled twice and keeps the rarer',
        jokeNew: "The roll gives a joke element you haven't found yet", level: 'Elements your luck has made rarer go back to their odds at 0% luck',
        bond: 'Fills the bond slot you are closest to completing, for free'
    };
    const k = Object.keys(f).find(x => more[x]);
    return k ? more[k] : "The roll gives an element you haven't found yet (+3,000% luck if you've found them all)";
}
const catLength = c => c.instant ? (c.fx.rod || c.fx.logger ? 'Waits for the next event' : 'Works straight away') : c.rolls ? (c.rolls === 1 ? 'Single roll' : `Next ${c.rolls} rolls`) : `Timed, ${c.min} min`;
// saved state
function loadJSON(k, d) {
    try {
        return JSON.parse(localStorage.getItem(k) || 'null') || d;
    } catch (e) {
        return d;
    }
}
let shopState = loadJSON('elementalShop', { slot: -1, stock: [] });
let catInv = loadJSON('elementalCatInv', {});
let catActive = loadJSON('elementalCatActive', {});
let catFlags = loadJSON('elementalCatFlags', {});
function saveCats() {
    try {
        localStorage.setItem('elementalShop', JSON.stringify(shopState));
        localStorage.setItem('elementalCatInv', JSON.stringify(catInv));
        localStorage.setItem('elementalCatActive', JSON.stringify(catActive));
        localStorage.setItem('elementalCatFlags', JSON.stringify(catFlags));
    } catch (e) { }
}
function takeFlag(k) {
    if (!(catFlags[k] > 0)) {
        return false;
    }
    catFlags[k]--;
    if (!catFlags[k]) {
        delete catFlags[k];
    }
    saveCats();
    return true;
}
// active catalysts
function pruneActive() {
    let ch = false;
    const now = Date.now();
    Object.keys(catActive).forEach(t => {
        const a = catActive[t];
        if (!a || !CAT[a.id] || (a.until && a.until <= now) || (a.rolls != null && a.rolls <= 0)) {
            delete catActive[t];
            ch = true;
        }
    });
    if (ch) {
        saveCats();
        buffCache = weightCache = null;
    }
    return catActive;
}
function activeList() {
    pruneActive();
    return Object.keys(catActive).sort((a, b) => a - b).map(t => ({ tier: +t, a: catActive[t], c: CAT[catActive[t].id] }));
}
// totals from active timed catalysts, for computeBuffs and weightTable
function catBonus() {
    const r = {
        luck: 0, speed: 0, quark: 0, extra: 0, chain: 0, chainMax: false, fam: {},
        event: 0, lens: 0, heavy: 0, joke: 0, laugh: false, gag: 0, level: false
    };
    activeList().forEach(({ a, c }) => {
        if (!a.until) {
            return;
        }
        const f = c.fx;
        ['event', 'lens', 'heavy', 'joke'].forEach(k => r[k] += f[k] || 0);
        if (f.laugh) {
            r.laugh = true;
        }
        if (f.level) {
            r.level = true;
        }
        if (f.gag) {
            r.gag = a.hit ? 10 : 5;
        }
        if (f.luck) {
            r.luck += f.luck;
        }
        if (f.speed) {
            r.speed += f.speed;
        }
        if (f.quark) {
            r.quark += f.quark;
        }
        if (f.extra) {
            r.extra += f.extra;
        }
        if (f.chain) {
            r.chain += f.chain;
        }
        if (f.chainMax) {
            r.chainMax = true;
        }
        if (f.fam) {
            r.fam[f.fam] = (r.fam[f.fam] || 0) + f.pct;
        }
    });
    return r;
}
// the soonest moment an active catalyst runs out, so cached buffs refresh then
function catNextExpiry() {
    let t = Infinity;
    Object.values(catActive).forEach(a => {
        if (a.until) {
            t = Math.min(t, a.until);
        }
    });
    return t;
}
function useCatalyst(id, n) {
    const c = CAT[id];
    const have = catInv[id] || 0;
    n = Math.max(0, Math.min(have, Math.floor(n)));
    if (!n) {
        return 'You have none of these.';
    }
    if (c.instant) {
        return useInstant(c, n);
    }
    pruneActive();
    const cur = catActive[c.tier];
    if (cur && cur.id !== id) {
        const o = CAT[cur.id];
        return `${o.name} is already running for ${CAT_TIERS[c.tier].name.toLowerCase()} catalysts (${catLeft(cur)} left). Only one ${CAT_TIERS[c.tier].name.toLowerCase()} catalyst can be active at a time.`;
    }
    if (c.rolls) {
        catActive[c.tier] = { id, rolls: (cur ? cur.rolls : 0) + c.rolls * n };
    } else {
        const base = cur ? cur.until : Date.now();
        catActive[c.tier] = { id, until: base + c.min * 60000 * n * (1 + bondBonus().cdur / 100) };
    }
    catInv[id] = have - n;
    if (!catInv[id]) {
        delete catInv[id];
    }
    saveCats();
    buffCache = weightCache = null;
    return '';
}
function useInstant(c, n) {
    const f = c.fx;
    if (f.start) {
        if (anyEventOn()) {
            return 'An event is already running. Only one can run at a time.';
        }
        n = 1;
        if (f.start === 'storm') {
            qStormStart();
        } else {
            evStart(f.start);
        }
        renderQStorm();
    } else if (f.restock) {
        n = 1;
        const held = bondBonus().hold && shopState.stock.find(s => s.held && !s.sold);
        shopState.stock = held ? [held] : [];
        shopCheck();
    } else if (f.bond) {
        let done = 0;
        for (; done < n; done++) {
            const s = closestSlot();
            if (!s) {
                break;
            }
            fillFree(s.id);
        }
        if (!done) {
            return 'There are no open bond slots to fill.';
        }
        n = done;
        showAchievementToast({ kicker: 'Bonding Agent', name: done > 1 ? done + ' bond slots filled' : 'Bond slot filled', flavor: 'Paid for in full. Check the bonds tree.' });
        if ($('bonds').classList.contains('active')) {
            bondSummary();
            netDrawSoon();
        }
    } else if (f.extend) {
        pruneActive();
        const timed = Object.values(catActive).filter(a => a.until);
        if (!timed.length) {
            return 'No timed catalysts are running to extend.';
        }
        timed.forEach(a => a.until += f.extend * 60000 * n);
    } else {
        const k = f.rod ? 'rod' : f.logger ? 'logger' : 'grant';
        catFlags[k] = (catFlags[k] || 0) + n;
    }
    catInv[c.id] -= n;
    if (!catInv[c.id]) {
        delete catInv[c.id];
    }
    saveCats();
    buffCache = weightCache = null;
    renderActiveCats();
    return '';
}
function catLeft(a) {
    if (a.rolls != null) {
        return a.rolls + (a.rolls === 1 ? ' roll' : ' rolls');
    }
    return fmtClock(Math.max(0, a.until - Date.now()) / 1000);
}
function fmtClock(s) {
    s = Math.ceil(s);
    if (s >= 172800) {
        const d = Math.floor(s / 86400);
        return `${d.toLocaleString('en-US')}d ${Math.floor(s % 86400 / 3600)}h`;
    }
    const h = Math.floor(s / 3600);
    const m = Math.floor(s % 3600 / 60);
    const ss = s % 60;
    return h ? `${h}:${String(m).padStart(2, '0')}:${String(ss).padStart(2, '0')}` : `${m}:${String(ss).padStart(2, '0')}`;
}
// single-roll catalysts: take one charge for one individual roll
function takeRollCharge() {
    pruneActive();
    const out = { rollLuck: 0, unfound: false, linked: false, magnet: false, chain3: false, twice: false, jokeNew: false, used: [] };
    Object.keys(catActive).forEach(t => {
        const a = catActive[t];
        if (a.rolls == null || a.rolls <= 0) {
            return;
        }
        out.used.push(CAT[a.id].name);
        const f = CAT[a.id].fx;
        if (f.rollLuck) {
            out.rollLuck += f.rollLuck;
        }
        if (f.unfound) {
            out.unfound = true;
        }
        ['linked', 'magnet', 'chain3', 'twice', 'jokeNew'].forEach(k => {
            if (f[k]) {
                out[k] = true;
            }
        });
        // refund chance
        if (Math.random() >= bondBonus().refund / 100) {
            a.rolls -= 1;
        }
    });
    pruneActive();
    saveCats();
    return out;
}
// catalyst drops from the easy bridge, picked like shop stock
function rollDrop() {
    const p = bondBonus().drop / 100;
    if (!p || Math.random() >= p) {
        return null;
    }
    const id = shopRoll();
    catInv[id] = (catInv[id] || 0) + 1;
    saveCats();
    return id;
}
function showDrop(id, k) {
    const c = CAT[id];
    const el = document.createElement('div');
    el.className = 'cat-drop';
    el.style.setProperty('--tc', CAT_TIERS[c.tier].col);
    el.style.animationDelay = (k * 0.45) + 's';
    el.innerHTML = '<span>Catalyst found</span><b>' + c.name + '</b>' + tierChip(c.tier);
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 3200 + k * 450);
}
// running gag goes to x10
function gagHit() {
    const a = Object.values(catActive).find(x => x.id === 'gag' && !x.hit);
    if (a) {
        a.hit = true;
        saveCats();
        buffCache = weightCache = null;
    }
}
function clearCatalyst(tier) {
    delete catActive[tier];
    saveCats();
    buffCache = weightCache = null;
}
// the shop
function shopPeriodMs() {
    const b = bondBonus();
    return Math.max(5, 20 - b.refresh) * 60000;
}
// 2 + bonds, max 6
const shopSlots = () => Math.min(6, 2 + bondBonus().slots);
function shopPrice(c, grant = true) {
    return Math.max(1, Math.round(c.price * (1 - Math.min(90, bondBonus().price) / 100) * (grant && catFlags.grant ? 0.5 : 1)));
}
var clockBase = null;
var clockTried = false;
function shopNow() {
    return clockBase ? clockBase.server + (performance.now() - clockBase.perf) : Date.now();
}
function shopCheck() {
    const P = shopPeriodMs();
    const now = shopNow();
    const want = shopSlots();
    if (!shopState.nextAt) {
        // older saves: keep the stock and timer they already had
        shopState.nextAt = shopState.slot >= 0 && shopState.period ? (shopState.slot + 1) * shopState.period : now + P;
    }
    // a restock time further off than one full period can only come from a wrong clock
    if (shopState.nextAt > now + P + 60000 && (clockBase || clockTried)) {
        shopState.nextAt = now + P;
    }
    // wait until the clock has been checked before restocking (the first few seconds only)
    if (now >= shopState.nextAt && (clockBase || clockTried || !shopState.stock.length)) {
        shopState.nextAt = (now - shopState.nextAt) / P > 1000 ? now + P : shopState.nextAt;
        while (shopState.nextAt <= now) {
            shopState.nextAt += P;
        }
        // keep the held one
        const held = bondBonus().hold && shopState.stock.find(s => s.held && !s.sold);
        shopState.stock = held ? [held] : [];
    }
    while (shopState.stock.length < want) {
        shopState.stock.push({ id: shopRoll(), sold: false });
    }
    saveCats();
    return shopState;
}
function shopRoll() {
    const boost = bondBonus().stock / 100;
    const w = CAT_TIERS.map((t, i) => t.p * (1 + boost * i / 3));
    const tot = w.reduce((a, b) => a + b, 0);
    let r = Math.random() * tot;
    let tier = 0;
    for (; tier < w.length - 1; tier++) {
        r -= w[tier];
        if (r <= 0) {
            break;
        }
    }
    const jokes = bondBonus().jokecat && jokesOn();
    const allJokes = jokesFound().size === JOKES.length;
    const pool = CATALYSTS.filter(c => c.tier === tier && (!c.joke || jokes) && !(c.id === 'insidejoke' && allJokes));
    const wt = c => c.joke ? 1 + bondBonus().jokerate / 100 : 1;
    let x = Math.random() * pool.reduce((s, c) => s + wt(c), 0);
    return (pool.find(c => (x -= wt(c)) < 0) || pool[pool.length - 1]).id;
}
// a new save has no stock yet, so stock the shop before reading its timer
function shopNextIn() {
    if (!shopState.nextAt) {
        shopCheck();
    }
    return shopState.nextAt - shopNow();
}
function buyStock(i) {
    const s = shopState.stock[i];
    if (!s || s.sold) {
        return;
    }
    const c = CAT[s.id];
    const p = shopPrice(c);
    if (quarks < p) {
        return;
    }
    addQuarks(-p);
    takeFlag('grant');
    s.sold = true;
    s.held = false;
    const two = Math.random() < bondBonus().dup / 100;
    catInv[s.id] = (catInv[s.id] || 0) + (two ? 2 : 1);
    saveCats();
    renderShop();
    $('shopMsg').textContent = two ? `Lucky: two ${c.name} catalysts added to your inventory.` : `${c.name} added to your inventory.`;
}
function holdStock(i) {
    const s = shopState.stock[i];
    if (!s || s.sold || !bondBonus().hold) {
        return;
    }
    const on = !s.held;
    shopState.stock.forEach(x => x.held = false);
    s.held = on;
    saveCats();
    renderShop();
    $('shopMsg').textContent = on ? `${CAT[s.id].name} will stay in the shop through restocks until you buy it or let it go.` : '';
}
const tierChip = t => `<span class="cat-tier" style="--tc:${CAT_TIERS[t].col}">${CAT_TIERS[t].name}</span>`;
function renderShop() {
    if (!$('shopStock')) {
        return;
    }
    shopCheck();
    const canHold = bondBonus().hold;
    $('shopTimer').textContent = fmtClock(shopNextIn() / 1000);
    $('shopStock').innerHTML = shopState.stock.map((s, i) => {
        const c = CAT[s.id];
        const p = shopPrice(c);
        const hold = canHold && !s.sold ? `<button class="ghost cat-hold${s.held ? ' on' : ''}" data-i="${i}">${s.held ? 'Held' : 'Hold'}</button>` : '';
        return `<article class="cat-card${s.sold ? ' sold' : ''}${s.held ? ' held' : ''}" style="--tc:${CAT_TIERS[c.tier].col}">${tierChip(c.tier)}<h3>${c.name}</h3><p>${catEffect(c)}</p><p class="cat-len">${catLength(c)}</p><button class="${s.sold ? 'ghost' : 'primary'} cat-buy" data-i="${i}"${s.sold || quarks < p ? ' disabled' : ''}>${s.sold ? 'Bought' : `<span class="q-sym">q</span> ${p.toLocaleString('en-US')}`}</button>${hold}</article>`;
    }).join('');
    $('shopSlotsNote').textContent = `${shopState.stock.length} of ${Math.max(5, shopSlots())} stock slots open`;
    renderActiveCats();
}
function renderActiveCats() {
    const list = activeList();
    const waiting = [['rod', 'Lightning Rod', 'next Quark Storm'], ['logger', 'Event Logger', 'next event'], ['grant', 'Grant Funding', 'next purchase']]
        .filter(([k]) => catFlags[k] > 0).map(([k, name, what]) => `<div class="act-row" style="--tc:${CAT_TIERS[CAT[k].tier].col}">${tierChip(CAT[k].tier)}<strong>${name}${catFlags[k] > 1 ? ' ×' + catFlags[k] : ''}</strong><span class="act-left">Waiting: ${what}</span></div>`).join('');
    const html = list.length || waiting ? list.map(({ tier, a, c }) => `<div class="act-row" style="--tc:${CAT_TIERS[tier].col}">${tierChip(tier)}<strong>${c.name}</strong><span class="act-left" data-tier="${tier}">${catLeft(a)}</span></div>`).join('') + waiting : '<p class="muted">No catalysts active.</p>';
    ['catActive', 'rollCats'].forEach(k => {
        const el = $(k);
        if (el) {
            el.innerHTML = list.length || waiting ? (k === 'catActive' ? '<div class="inv-sect"><span>Active</span></div>' : '') + html : '';
        }
    });
    const cl = $('catClear');
    if (cl) {
        cl.innerHTML = list.length ? list.map(({ tier, c }) => `<div class="act-row" style="--tc:${CAT_TIERS[tier].col}">${tierChip(tier)}<strong>${c.name}</strong><button class="ghost cat-clear" data-tier="${tier}">Clear</button></div>`).join('') : '<p class="muted">No catalysts active.</p>';
    }
    const hs = $('homeShop');
    if (hs) {
        hs.textContent = 'Restock in ' + fmtClock(Math.max(0, shopNextIn()) / 1000);
    }
}
$('shopStock').addEventListener('click', e => {
    const h = e.target.closest('.cat-hold');
    if (h) {
        holdStock(+h.dataset.i);
        return;
    }
    const b = e.target.closest('.cat-buy');
    if (b) {
        buyStock(+b.dataset.i);
    }
});
// the inventory page: a grid of owned catalysts and a detail panel for the selected one
let invSel = null;
const catMark = c => {
    const w = c.name.replace(/Catalyst|'s/g, '').trim().split(/[\s-]+/);
    return w.length > 1 ? w[0][0] + w[1][0].toLowerCase() : w[0].slice(0, 2);
};
function renderCatInv() {
    if (!$('catInv')) {
        return;
    }
    const inv = Object.keys(catInv).filter(id => catInv[id] > 0 && CAT[id]).sort((a, b) => CAT[b].tier - CAT[a].tier || CAT[a].name.localeCompare(CAT[b].name));
    if (!inv.includes(invSel)) {
        invSel = inv[0] || null;
    }
    $('catInv').innerHTML = inv.length ? inv.map(id => {
        const c = CAT[id];
        return `<button class="inv-tile${id === invSel ? ' sel' : ''}" data-sel="${id}" style="--tc:${CAT_TIERS[c.tier].col}"><span class="it-name">${c.name}</span><span class="it-n">×${catInv[id].toLocaleString('en-US')}</span></button>`;
    }).join('') : '<p class="muted inv-empty">Nothing here yet. Catalysts you buy in the shop wait here until you use them.</p>';
    const d = $('invDetail');
    if (!invSel) {
        d.innerHTML = '<div class="inv-preview" style="--tc:var(--soft)"><span class="ip-mark">–</span></div><p class="muted">Select a catalyst to see it here.</p>';
    } else {
        const c = CAT[invSel];
        const T = CAT_TIERS[c.tier];
        const a = catActive[c.tier];
        const status = c.instant ? '' : a && a.id === invSel ? `<p class="ip-status on">Running: ${catLeft(a)} left. Using more adds to it.</p>` : a ? `<p class="ip-status off">${CAT[a.id].name} is running for ${T.name.toLowerCase()} catalysts (${catLeft(a)} left), so this one can't be used until it ends.</p>` : '';
        const n = catInv[invSel];
        d.innerHTML = `<div class="inv-preview" style="--tc:${T.col}"><span class="ip-mark">${catMark(c)}</span><span class="ip-tier">${T.name}</span></div>
<div class="ip-use"><button class="primary" data-use="1">Use</button>${n > 1 ? '<button class="ghost" data-use="pick">Use…</button><button class="ghost" data-use="all">Use all</button>' : ''}</div>
<p class="shop-msg" id="invMsg" aria-live="polite"></p>
<div class="ip-desc" style="--tc:${T.col}"><h2>${c.name}</h2>${tierChip(c.tier)}<p class="ip-effect">${catEffect(c)}</p><dl class="stats"><div><dt>Lasts</dt><dd>${catLength(c)}</dd></div><div><dt>You have</dt><dd>×${n.toLocaleString('en-US')}</dd></div>${c.rolls || c.instant ? '' : `<div><dt>Using all</dt><dd>${fmtClock(c.min * 60 * n)}</dd></div>`}</dl>${status}</div>`;
    }
    renderActiveCats();
}
$('catInv').addEventListener('click', e => {
    const t = e.target.closest('[data-sel]');
    if (!t) {
        return;
    }
    invSel = t.dataset.sel;
    renderCatInv();
    if (innerWidth < 760) {
        $('invDetail').scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
});
$('invDetail').addEventListener('click', e => {
    const b = e.target.closest('[data-use]');
    if (!b || !invSel) {
        return;
    }
    const id = invSel;
    const have = catInv[id];
    const n = b.dataset.use === 'all' ? have : b.dataset.use === 'pick' ? parseInt(prompt(`How many ${CAT[id].name} to use? You have ${have}.`, '1'), 10) : 1;
    if (!n || n < 1) {
        return;
    }
    const msg = useCatalyst(id, n);
    renderCatInv();
    const m = $('invMsg');
    if (m) {
        m.textContent = msg || `${n > 1 ? n + ' × ' : ''}${CAT[id].name} used.`;
        m.classList.toggle('ok', !msg);
    }
    renderRollStats();
});
$('catClear').addEventListener('click', e => {
    const b = e.target.closest('.cat-clear');
    if (!b) {
        return;
    }
    const t = +b.dataset.tier;
    const a = catActive[t];
    if (!a) {
        return;
    }
    const c = CAT[a.id];
    if (!confirm(`Clear ${c.name}?\n\nIt stops working straight away with ${catLeft(a)} left. You will not get it back.`)) {
        return;
    }
    if (!confirm(`Are you sure? This can't be undone.`)) {
        return;
    }
    clearCatalyst(t);
    renderActiveCats();
    renderRollStats();
});
// tick timers once a second
setInterval(() => {
    const before = Object.keys(catActive).length;
    pruneActive();
    if (Object.keys(catActive).length !== before) {
        renderRollStats();
    }
    if ($('shop') && $('shop').classList.contains('active')) {
        if (shopNow() >= (shopState.nextAt || 0)) {
            renderShop();
        } else {
            $('shopTimer').textContent = fmtClock(Math.max(0, shopNextIn()) / 1000);
            document.querySelectorAll('#catActive .act-left').forEach(el => {
                const a = catActive[el.dataset.tier];
                if (a) {
                    el.textContent = catLeft(a);
                }
            });
        }
    } else if ($('catinv').classList.contains('active')) {
        document.querySelectorAll('#catActive .act-left').forEach(el => {
            const a = catActive[el.dataset.tier];
            if (a) {
                el.textContent = catLeft(a);
            }
        });
    } else {
        renderActiveCats();
    }
}, 1000);
function activeBuffStats() {
    if (buffCache && Date.now() < buffCache.exp) {
        return buffCache;
    }
    return buffCache = computeBuffs();
}
function computeBuffs() {
    const found = discoveredSymbols();
    let luck = 0;
    let speed = 0;
    let extra = 0;
    let chainSteps = 0;
    let autoUnlock = false;
    let autoTime = 0;
    let autoCool = 0;
    let autoSpeed = 0;
    found.forEach(sym => {
        const b = ELEMENT_BUFFS.get(sym);
        if (!b) {
            return;
        }
        if (b.type === 'autounlock') {
            autoUnlock = true;
        }
        if (b.type === 'autospeed') {
            autoSpeed += b.value;
        }
        if (b.type === 'autotime') {
            autoTime += b.value;
        }
        if (b.type === 'autocool') {
            autoCool += b.value;
        }
        if (b.type === 'luck') {
            luck += b.value;
        }
        if (b.type === 'speed') {
            speed += b.value;
        }
        if (b.type === 'extra') {
            extra += 1;
        }
        if (b.type === 'chain') {
            chainSteps += 1;
        }
    });
    const bd = bondBonus();
    const cb = catBonus();
    const denom = Math.max(3, 8 - 0.625 * Math.min(8, chainSteps + bd.chain));
    return {
        found, luck: (luck + bd.add) * bd.mult + cb.luck, speed: speed + cb.speed, autoUnlocked: autoUnlock, autoSpeed: autoSpeed + bd.auto, autoGap: Math.max(AUTO_MIN_GAP, AUTO_BASE_GAP / (1 + (autoSpeed + bd.auto) / 100)), extra: Math.min(3, extra + bd.extra + cb.extra), chainSteps: Math.min(8, chainSteps), chainDenom: cb.chainMax ? 3 : Math.max(3, denom - cb.chain), fam: cb.fam, quark: cb.quark + bd.quark,
        // reagent/punchline add, running gag multiplies
        jokeMult: (1 + cb.joke / 100) * (cb.gag || 1), level: cb.level, exp: catNextExpiry()
    };
}
function weightTable(extraLuck, only) {
    const b = activeBuffStats();
    if (!extraLuck && !only && weightCache && weightCache.b === b && weightCache.pool.length === rollPool().length) {
        return weightCache;
    }
    const luck = b.luck + (extraLuck || 0);
    let total = 0;
    let total0 = 0;
    const pool = rollPool();
    const flat = [];
    const w = pool.map(e => {
        if (only && !only(e)) {
            flat.push(0);
            return 0;
        }
        const m = (1 + (b.fam[familyOf(e[0])] || 0) / 100) * (isJoke(e[0]) ? b.jokeMult : 1) / e[2];
        const v = m * Math.pow(1 + 1.5 * (Math.log10(e[2] + 1) / 3), (luck / 100) / 1.5);
        flat.push(m);
        total += v;
        total0 += m;
        return v;
    });
    // leveller: anything luck has made rarer gets its 0% luck share back
    if (b.level && total0) {
        const k = total / total0;
        total = 0;
        for (let i = 0; i < w.length; i++) {
            w[i] = Math.max(w[i], flat[i] * k);
            total += w[i];
        }
    }
    const t = { w, total, b, pool };
    if (!extraLuck && !only) {
        weightCache = t;
    }
    return t;
}
// one element, with the active buffs; extraLuck and only come from single-roll catalysts
function weightedElement(extraLuck, only) {
    const { w, total, pool } = weightTable(extraLuck, only);
    let r = Math.random() * total;
    for (let i = 0; i < pool.length; i++) {
        r -= w[i];
        if (r <= 0) {
            return pool[i];
        }
    }
    return pool[pool.length - 1];
}
// joke table
let jokeMix = true;
let jokeHide = false;
try {
    jokeMix = localStorage.getItem('elementalJokeMix') !== '0';
    jokeHide = localStorage.getItem('elementalJokeHide') === '1';
} catch (e) { }
const jokesOn = () => bondBonus().joke;
const rollPool = () => jokesOn() ? ELEMENTS.concat(JOKES) : ELEMENTS;
// false = chain stops (mixing off rule)
function chainStep(elements, e) {
    if (jokeMix || !jokesOn() || isJoke(e[0]) === isJoke(elements[0][0])) {
        elements.push(e);
        return true;
    }
    if (isJoke(e[0])) {
        elements.length = 0;
        elements.push(e);
    }
    return false;
}
function rollElements(luckUp, first, o) {
    const elements = [first || weightedElement(luckUp)];
    const fam = o.magnet ? familyOf(elements[0][0]) : null;
    const only = fam ? (e => familyOf(e[0]) === fam) : undefined;
    while (elements.length < 30 && ((o.linked && elements.length === 1) || Math.random() < 1 / o.denom)) {
        if (!chainStep(elements, weightedElement(luckUp, only))) {
            break;
        }
    }
    return elements;
}
// black hole / twin horizon
function rollTwice(make) {
    const a = make();
    const b = make();
    return exactRarity(b, 0) < exactRarity(a, 0) ? b : a;
}
function quarkMult(elements, buffs) {
    const cb = catBonus();
    const n = elements.length;
    const pct = (buffs.quark || 0) + (n === 1 ? bondBonus().alone : 0) + (n > 1 ? cb.lens : 0) + cb.heavy * (n - 1);
    return (1 + pct / 100) * (cb.laugh && elements.some(e => isJoke(e[0])) ? 3 : 1);
}
// + Redactium
const secretChance = () => SECRET_CHANCE + bondBonus().secret / 100;
function hillFormula(elements) {
    const counts = {};
    elements.forEach(e => counts[e[0]] = (counts[e[0]] || 0) + 1);
    let syms = Object.keys(counts);
    syms.sort((a, b) => {
        if (counts.C && a === 'C') {
            return -1;
        }
        if (counts.C && b === 'C') {
            return 1;
        }
        if (counts.C && a === 'H' && b !== 'C') {
            return -1;
        }
        if (counts.C && b === 'H' && a !== 'C') {
            return 1;
        }
        return a.localeCompare(b);
    });
    return syms.map(s => s + (counts[s] > 1 ? counts[s] : '')).join('');
}
const BASE_CHAIN = 8;
// Odds are always base odds: no luck, chain or other buffs are counted
function exactRarity(elements, guaranteedExtras = 0) {
    const n = Math.max(1, elements.length - guaranteedExtras);
    let log10 = -(n - 1) * Math.log10(BASE_CHAIN);
    elements.forEach(e => log10 -= Math.log10(elementBySymbol[e[0]][2]));
    return log10;
}
// ions: 1/100 for +, 1/1000 for -, - wins a tie
const ION_PLUS = 0.01;
const ION_MINUS = 0.001;
const ION_MAX = 3;
function rollIon() {
    if (!bondBonus().ion) {
        return 0;
    }
    const plus = Math.random() < ION_PLUS;
    const minus = Math.random() < ION_MINUS;
    if (!plus && !minus) {
        return 0;
    }
    const p = minus ? ION_MINUS : ION_PLUS;
    let n = 1;
    while (n < ION_MAX && Math.random() < p) {
        n++;
    }
    return minus ? -n : n;
}
const ionScoreMult = ion => ion > 0 ? 1.5 * ion : ion < 0 ? -3 * ion : 1;
const ionLog = ion => ion > 0 ? -2 * ion : ion < 0 ? 3 * ion : 0;
const ION_SUP = ['', '', '²', '³'];
const ionText = ion => ion ? ION_SUP[Math.abs(ion)] + (ion > 0 ? '⁺' : '⁻') : '';
const withIon = (formula, ion) => formula + ionText(ion || 0);
const entryIons = c => ionText(c.ionP || 0) + ionText(-(c.ionN || 0));
function ionise(rec, ion) {
    rec.ion = ion;
    if (ion) {
        rec.baseLog = rec.log;
        rec.baseScore = rec.score;
        rec.log += ionLog(ion);
        rec.score *= ionScoreMult(ion);
        rec.rarity = rarityText(rec.log);
    }
    return rec;
}
let ionMarks = {};
let ionNew = [];
try {
    const v = JSON.parse(localStorage.getItem('elementalIons') || '{}');
    ionMarks = v.m || {};
    ionNew = v.n || [];
} catch (e) { }
function ionSave() {
    try {
        localStorage.setItem('elementalIons', JSON.stringify({ m: ionMarks, n: ionNew }));
    } catch (e) { }
}
function ionCredit(sym, ion) {
    if (!ion) {
        return;
    }
    const m = ionMarks[sym] || [0, 0];
    const k = ion > 0 ? 0 : 1;
    if (Math.abs(ion) > m[k]) {
        m[k] = Math.abs(ion);
        ionMarks[sym] = m;
        if (!ionNew.includes(sym)) {
            ionNew.push(sym);
        }
        ionSave();
    }
}
function rarityText(log) {
    const value = 10 ** (-log);
    if (Number.isFinite(value) && value < 1e21) {
        return '1/' + Math.max(1, Math.round(value)).toLocaleString('en-US', { maximumFractionDigits: 0 });
    }
    return '≈ 1/' + value.toExponential(2).replace('+', '');
}
// Quarks earned by one roll
const QUARK_RATE = 0.1;
const QUARK_KNEE = 10000;
function quarksFor(score, mult) {
    const base = score <= QUARK_KNEE ? Math.sqrt(score) : Math.pow(score, 0.75) / Math.pow(QUARK_KNEE, 0.25);
    return base * QUARK_RATE * mult;
}
// Score = the base odds of every element in the roll added together.
function rollScore(elements) {
    return elements.reduce((sum, e) => sum + elementBySymbol[e[0]][2], 0);
}
function fmtScore(n) {
    return Math.round(n).toLocaleString('en-US');
}
let displayMode = 'odds';
try {
    displayMode = localStorage.getItem('elementalDisplay') === 'score' ? 'score' : 'odds';
} catch (e) { }
// The rarity shown for a record, as odds or score depending on the setting (or a forced mode).
function rarityShown(rec, mode = displayMode) {
    if (mode === 'score') {
        return fmtScore(Number.isFinite(rec.score) ? rec.score : rollScore(rec.elements));
    }
    return Number.isFinite(rec.log) ? rarityText(rec.log) : (rec.rarity || '');
}
function rarityWord(mode = displayMode) {
    return mode === 'score' ? 'Score' : 'Odds';
}
const APP_VERSION = '2.0.5.2';
let quarks = 0;
try {
    quarks = parseFloat(localStorage.getItem('elementalQuarks')) || 0;
} catch (e) { }
function renderQuarks() {
    const el = $('quarkCount');
    if (el) {
        el.textContent = quarks.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }
}
function addQuarks(n) {
    quarks += n;
    try {
        localStorage.setItem('elementalQuarks', String(quarks));
    } catch (e) { }
    renderQuarks();
}
// Quark Storm. After any press of Roll there's a 1 in 8,000 chance of a storm, which
// lasts the next 100 presses
const QSTORM_CHANCE = 1 / 8000;
const QSTORM_PRESSES = 100;
const QSTORM_MIN = 2;
const QSTORM_MAX = 30;
let qStorm = null;
try {
    const v = JSON.parse(localStorage.getItem('elementalQStorm') || 'null');
    qStorm = v && v.left > 0 ? { left: Math.min(QSTORM_PRESSES * 3, Math.floor(v.left)), got: +v.got || 0 } : null;
} catch (e) { }
function qStormSave() {
    try {
        if (qStorm) {
            localStorage.setItem('elementalQStorm', JSON.stringify(qStorm));
        } else {
            localStorage.removeItem('elementalQStorm');
        }
    } catch (e) { }
}
const qStormOn = () => !!(qStorm && qStorm.left > 0);
// ring 1 raises these
function qStormRange() {
    const s = bondBonus().storm / 100;
    return [QSTORM_MIN + Math.round(2 * s), QSTORM_MAX + Math.round(20 * s)];
}
const eventChanceMult = () => 1 + (bondBonus().event + catBonus().event) / 100;
const qStormChance = () => QSTORM_CHANCE * eventChanceMult();
// deja-vium, lightning rod, event logger
function eventLength(base, storm) {
    return Math.round(base * (1 + bondBonus().evlen / 100) * (storm && takeFlag('rod') ? 1.5 : 1) * (takeFlag('logger') ? 2 : 1));
}
function qStormStart() {
    qStorm = { left: eventLength(QSTORM_PRESSES, true), got: 0 };
    qStormSave();
}
// One press of Roll with count rolls
function qStormPress(count) {
    if (qStormOn()) {
        const [lo, hi] = qStormRange();
        const add = Array.from({ length: count }, () => lo + Math.floor(Math.random() * (hi - lo + 1)));
        const sum = add.reduce((a, b) => a + b, 0);
        qStorm.left--;
        qStorm.got += sum;
        const ended = qStorm.left <= 0 ? qStorm.got : 0;
        if (ended) {
            qStorm = null;
        }
        qStormSave();
        return { add, sum, ended };
    }
    if (Math.random() < qStormChance()) {
        qStormStart();
        return { started: true };
    }
    return null;
}
// supercollider + black hole, one event at a time
const EVENTS = {
    collider: { name: 'Supercollider', chance: 1 / 8000, presses: 50, what: 'chain chance is 1 in 2' },
    hole: { name: 'Black Hole', chance: 1 / 8000, presses: 50, what: 'every roll is rolled twice and keeps the rarer' }
};
let evRun = null;
try {
    const v = JSON.parse(localStorage.getItem('elementalEvent') || 'null');
    evRun = v && EVENTS[v.id] && v.left > 0 ? { id: v.id, left: Math.min(500, Math.floor(v.left)) } : null;
} catch (e) { }
function evSave() {
    try {
        if (evRun) {
            localStorage.setItem('elementalEvent', JSON.stringify(evRun));
        } else {
            localStorage.removeItem('elementalEvent');
        }
    } catch (e) { }
}
const evOn = id => !!evRun && (!id || evRun.id === id);
const anyEventOn = () => qStormOn() || evOn();
const eventNow = () => qStormOn() ? 'storm' : evOn() ? evRun.id : null;
function evStart(id) {
    evRun = { id, left: eventLength(EVENTS[id].presses, false) };
    evSave();
}
function eventsPress(count) {
    if (evOn()) {
        const id = evRun.id;
        evRun.left--;
        if (evRun.left <= 0) {
            evRun = null;
        }
        evSave();
        return { ev: id, ended: !evRun };
    }
    const st = qStormPress(count);
    if (st) {
        return st;
    }
    for (const id of Object.keys(EVENTS)) {
        if (Math.random() < EVENTS[id].chance * eventChanceMult()) {
            evStart(id);
            return { ev: id, started: true };
        }
    }
    return null;
}
function renderQStorm(last) {
    const bar = $('qStormBar');
    if (!bar) {
        return;
    }
    bar.className = 'qstorm-bar' + (evOn() ? ' ev-' + evRun.id : '');
    if (evOn()) {
        bar.hidden = false;
        bar.innerHTML = '<span class="qs-name">' + EVENTS[evRun.id].name + '</span><span class="qs-left"><b>' + evRun.left + '</b> ' + (evRun.left === 1 ? 'roll' : 'rolls') + ' left</span><span class="qs-got">' + EVENTS[evRun.id].what + '</span>';
        return;
    }
    bar.hidden = !qStormOn();
    if (!bar.hidden) {
        bar.innerHTML = '<span class="qs-name">Quark Storm</span><span class="qs-left"><b>' + qStorm.left + '</b> ' + (qStorm.left === 1 ? 'roll' : 'rolls') + ' left</span>' +
            '<span class="qs-got"><span class="q-sym" aria-hidden="true">q</span> +' + formatNumber(Math.round(qStorm.got)) + (last ? '<small>+' + last + ' this roll</small>' : '') + '</span>';
    }
}
// The most recent rolls, newest first: { n: roll number, f: formula, l: odds log, s: score }.
const HISTORY_MAX = 1000;
let rollHistory = [];
try {
    rollHistory = JSON.parse(localStorage.getItem('elementalHistory') || '[]');
} catch (e) { }
function addHistory(rec, n) {
    rollHistory.unshift(rec.ion ? { n, f: rec.formula, l: rec.log, s: rec.score, i: rec.ion } : { n, f: rec.formula, l: rec.log, s: rec.score });
    if (rollHistory.length > HISTORY_MAX) {
        rollHistory.length = HISTORY_MAX;
    }
    try {
        localStorage.setItem('elementalHistory', JSON.stringify(rollHistory));
    } catch (e) { }
}
function renderHistory() {
    const el = $('rollHistory');
    if (!el) {
        return;
    }
    if (!rollHistory.length) {
        el.innerHTML = '<div class="empty-line">Your rolls will be listed here.</div>';
        return;
    }
    el.innerHTML = rollHistory.map(h => `<div class="history-row"><span class="h-num">#${h.n.toLocaleString('en-US')}</span><span class="h-formula" title="${withIon(h.f, h.i)}">${withIon(h.f, h.i)}</span><span class="h-val">${displayMode === 'score' ? 'Score ' + fmtScore(h.s) : rarityText(h.l)}</span></div>`).join('');
}
// Older saves stored buffed odds, so convert them back to base odds.
(function () {
    let ch = false;
    collection.forEach(r => {
        if (!r || !Array.isArray(r.elements) || !r.elements.length) {
            return;
        }
        const sc = rollScore(r.elements);
        if (r.score !== sc) {
            r.score = sc;
            ch = true;
        }
        const lg = exactRarity(r.elements, 0);
        if (Number.isFinite(lg) && r.log !== lg) {
            r.log = lg;
            r.rarity = rarityText(lg);
            ch = true;
        }
    });
    if (ch) {
        save();
    }
})();
let selectedElementSymbol = 'H';
let elemReturn = 'inventory';
const FAMILY = {};
const FAMILY_NAMES = {
    alkali: 'Alkali metals', alkaline: 'Alkaline earth metals', transition: 'Transition metals', post: 'Post-transition metals', metalloid: 'Metalloids', nonmetal: 'Nonmetals', halogen: 'Halogens', noble: 'Noble gases', lanth: 'Lanthanides', actin: 'Actinides', unknown: 'Unclassified'
};
(function () {
    const set = (cls, arr) => arr.forEach(s => FAMILY[s] = cls);
    set('alkali', ['Li', 'Na', 'K', 'Rb', 'Cs', 'Fr']);
    set('alkaline', ['Be', 'Mg', 'Ca', 'Sr', 'Ba', 'Ra']);
    set('nonmetal', ['H', 'C', 'N', 'O', 'P', 'S', 'Se']);
    set('halogen', ['F', 'Cl', 'Br', 'I', 'At', 'Ts']);
    set('noble', ['He', 'Ne', 'Ar', 'Kr', 'Xe', 'Rn', 'Og']);
    set('metalloid', ['B', 'Si', 'Ge', 'As', 'Sb', 'Te']);
    set('post', ['Al', 'Ga', 'In', 'Sn', 'Tl', 'Pb', 'Bi', 'Po']);
    set('lanth', ['La', 'Ce', 'Pr', 'Nd', 'Pm', 'Sm', 'Eu', 'Gd', 'Tb', 'Dy', 'Ho', 'Er', 'Tm', 'Yb', 'Lu']);
    set('actin', ['Ac', 'Th', 'Pa', 'U', 'Np', 'Pu', 'Am', 'Cm', 'Bk', 'Cf', 'Es', 'Fm', 'Md', 'No', 'Lr']);
    set('unknown', ['Mt', 'Ds', 'Rg', 'Cn', 'Nh', 'Fl', 'Mc', 'Lv']);
})();
function familyOf(sym) {
    return isJoke(sym) ? 'joke' : FAMILY[sym] || 'transition';
}
function buildTable(root, mode, list = ELEMENTS) {
    if (!root) {
        return;
    }
    root.innerHTML = '';
    const joke = list === JOKES;
    const found = joke ? jokesFound() : discoveredSymbols();
    // ion marks
    list.forEach((e, i) => {
        const pos = joke ? e[4] : tableLayout[e[0]] || [11, 1];
        const isFound = found.has(e[0]);
        const tile = document.createElement('button');
        tile.type = 'button';
        const im = ionMarks[e[0]];
        tile.dataset.sym = e[0];
        tile.className = 'element-tile' + (isFound ? ' discovered fam-' + familyOf(e[0]) : '') + (im && im[0] ? ' ion-p' + im[0] : '') + (im && im[1] ? ' ion-n' + im[1] : '');
        tile.style.gridRow = pos[0];
        tile.style.gridColumn = pos[1];
        tile.title = isFound ? `${e[1]}, ${joke ? e[3] : FAMILY_NAMES[familyOf(e[0])]}` : (mode === 'full' ? 'Not found yet. Select to see its bonus.' : 'Not found yet');
        tile.setAttribute('aria-label', `${e[1]}${isFound ? ', found' : ', not found yet'}`);
        tile.innerHTML = mode === 'full'
            ? `<span class="atomic">${isFound && !joke ? i + 1 : ''}</span><span class="sym">${isFound ? e[0] : ''}</span><span class="tiny">${isFound ? e[1] : ''}</span>`
            : `<span class="sym">${isFound ? e[0] : ''}</span>`;
        tile.addEventListener('click', () => {
            if (mode === 'compact' && !found.has(e[0])) {
                return;
            }
            const cur = document.querySelector('.screen.active');
            elemReturn = cur && cur.id !== 'element' ? cur.id : elemReturn;
            selectedElementSymbol = e[0];
            renderPeriodic();
            go('element');
        });
        root.appendChild(tile);
    });
    ionShowNew();
}
function ionShowNew() {
    if (!ionNew.length) {
        return;
    }
    const scr = document.querySelector('.screen.active');
    const tiles = scr ? [...scr.querySelectorAll('.element-tile')].filter(t => ionNew.includes(t.dataset.sym) && t.offsetParent) : [];
    if (!tiles.length) {
        return;
    }
    tiles.forEach(t => {
        t.classList.remove('ion-new');
        void t.offsetWidth;
        t.classList.add('ion-new');
    });
    ionNew = ionNew.filter(s => !tiles.some(t => t.dataset.sym === s));
    ionSave();
}
function bonusRows(s) {
    const row = (k, v, cls) => `<div><dt>${k}</dt><dd${cls ? ` class="${cls}"` : ''}>${v}</dd></div>`;
    let h = row('Elements found', `${s.found.size} / 118`) + row('Luck', `+${s.luck.toFixed(2)}%`) + row('Scanner speed', `+${s.speed.toFixed(2)}%`) + row('Bonus rolls', `${s.extra} of 3`) + row('Chain chance', `1 in ${+s.chainDenom.toFixed(2)}`);
    if (s.autoUnlocked) {
        h += row('Autoroll speed', `+${s.autoSpeed.toFixed(1)}%`) + row('Break between rolls', fmtGap(s.autoGap));
    }
    return h + row('Autoroll', '', 'js-auto');
}
// the roll screen's Bonds button glows when a slot can be filled right now
function updateBondsAlert() {
    const b = $('rollBondsBtn');
    if (!b) {
        return;
    }
    const n = fillableIds().length;
    b.classList.toggle('alert', n > 0);
    b.title = n ? `${n} slot${n === 1 ? '' : 's'} ready to fill` : '';
}
function renderRollStats() {
    updateBondsAlert();
    const el = $('rollStats');
    if (!el) {
        return;
    }
    el.innerHTML = bonusRows(activeBuffStats());
    updateAutoBtn();
}
function renderHome() {
    if (!$('homeMap')) {
        return;
    }
    const list = groupedCollection();
    const total = totalRolls();
    const found = discoveredSymbols().size;
    const s = activeBuffStats();
    buildTable($('homeMap'), 'compact');
    $('mapCount').textContent = `${found} of 118 elements found.`;
    $('homeUnique').textContent = list.length + (list.length === 1 ? ' formula' : ' formulas');
    $('homeAch').textContent = unlockedAchievements.length + ' / ' + ACHIEVEMENTS.length;
    $('homeRolls').textContent = total.toLocaleString();
    $('homeChain').textContent = '1 in ' + (+s.chainDenom.toFixed(2));
    $('homeRarestH').textContent = displayMode === 'score' ? 'Highest score' : 'Rarest find';
    const r = (displayMode === 'score' ? scoreRanked() : list)[0];
    const box = $('homeRarest');
    if (!r) {
        box.innerHTML = '<p class="muted">Nothing logged yet. Roll once to start the log.</p>';
        return;
    }
    const rr = r.rarestRecord;
    box.innerHTML = `<div class="big-formula">${r.formula}</div><div class="big-name">${r.name}</div><div class="big-odds">${rarityWord()} ${rarityShown(rr)}</div>`;
}
function renderPeriodic() {
    const found = discoveredSymbols();
    buildTable($('periodic'), 'full');
    $('legend').innerHTML = Object.keys(FAMILY_NAMES).map(k => `<span><i class="dot fam-${k}"></i>${FAMILY_NAMES[k]}</span>`).join('') + '<span><i class="dot none"></i>Not found yet</span>';
    $('elementStats').textContent = `${found.size} / 118 elements found`;
    const stats = activeBuffStats();
    $('buffSummary').innerHTML = '<h2 class="side-h">Active bonuses</h2><dl class="stats">' + bonusRows(stats) + '</dl>';
    // joke table
    $('jokeWrap').hidden = !jokesOn();
    if (jokesOn()) {
        buildTable($('jokeTable'), 'full', JOKES);
        $('jokeStats').textContent = `Joke periodic table · ${jokesFound().size} / ${JOKES.length} found`;
    }
    const joke = isJoke(selectedElementSymbol);
    const e = joke ? elementBySymbol[selectedElementSymbol] : ELEMENTS.find(x => x[0] === selectedElementSymbol) || ELEMENTS[0];
    const isFound = joke ? jokesFound().has(e[0]) : found.has(e[0]);
    $('buffElementName').textContent = `${e[1]} (${e[0]})`;
    $('buffElementDesc').textContent = joke ? `${e[3]}. ${jokeBonusText(e[0])}.` : ELEMENT_BUFFS.get(e[0]).desc;
    $('buffElementState').textContent = isFound ? 'Active. This bonus always applies.' : 'Locked. Find this element once to activate it.';
    $('buffElementState').classList.toggle('active', isFound);
    renderElemCompounds();
    renderHome();
    renderRollStats();
}
function groupedCollection() {
    const g = new Map();
    collection.forEach(c => {
        if (!g.has(c.formula)) {
            g.set(c.formula, { ...c, count: 0, rarestRecord: c });
        }
        const x = g.get(c.formula);
        x.count += c.count || 1;
        if (Number.isFinite(c.log) && (!Number.isFinite(x.rarestRecord.log) || c.log < x.rarestRecord.log)) {
            x.rarestRecord = c;
        }
    });
    const L = c => Number.isFinite(c.rarestRecord.log) ? c.rarestRecord.log : 0;
    return [...g.values()].sort((a, b) => L(a) - L(b));
}
function scoreRanked() {
    return groupedCollection().map(c => ({ ...c, score: rollScore(c.elements) })).sort((a, b) => b.score - a.score);
}
function rankRow(c, rank, mode = displayMode) {
    const r = c.rarestRecord;
    const el = document.createElement('div');
    const joined = c.elements.map(e => e[1]).join(' + ');
    el.className = 'rank-row';
    el.innerHTML = `<div class="rank-num">${rank}</div><div class="rank-main"><div class="rank-formula">${c.formula}${entryIons(c) ? `<sup class="ion-sup">${entryIons(c)}</sup>` : ''}</div><div class="rank-name">${c.name}${c.elements.length > 1 && c.name !== joined ? ': ' + joined : ''}</div></div><div class="rank-odds"><b>${mode === 'score' ? 'Score ' + rarityShown(r, 'score') : rarityShown(r, 'odds')}</b><span>× ${c.count.toLocaleString()}</span></div>`;
    return el;
}
function renderInventory() {
    const root = $('compoundGrid');
    const list = groupedCollection();
    root.innerHTML = '';
    $('collectionStats').textContent = `${totalRolls().toLocaleString()} total rolls, ${list.length} unique formulas`;
    if (!list.length) {
        root.innerHTML = '<div class="empty"><strong>Nothing logged yet.</strong><p>Roll once to record your first formula.</p><button class="primary" data-go="game">Roll</button></div>';
        root.querySelector('[data-go]').addEventListener('click', () => go('game'));
        return;
    }
    (rankMode === 'score' ? scoreRanked() : list).slice(0, 10).forEach((c, i) => root.appendChild(rankRow(c, i + 1, rankMode)));
}
let rankMode = 'odds';
document.querySelectorAll('[data-rank]').forEach(b => b.addEventListener('click', () => {
    rankMode = b.dataset.rank;
    document.querySelectorAll('[data-rank]').forEach(x => x.classList.toggle('active', x === b));
    renderInventory();
}));
let elemMode = 'start';
function renderElemCompounds() {
    const root = $('elemCompounds');
    const sym = selectedElementSymbol;
    const el = ELEMENTS.find(x => x[0] === sym) || ELEMENTS[0];
    const found = discoveredSymbols().has(el[0]);
    const starts = c => (c.formula.match(/^[A-Z][a-z]?/) || [''])[0] === el[0];
    $('elemTitle').textContent = `${el[1]} (${el[0]})`;
    $('elemSub').textContent = `${FAMILY_NAMES[familyOf(el[0])]}, atomic number ${ELEMENTS.indexOf(el) + 1}. ${displayMode === 'score' ? 'Score ' + el[2].toLocaleString() : 'Base odds 1 in ' + el[2].toLocaleString()}. ${found ? 'Found.' : 'Not found yet.'}`;
    const list = !found ? [] : (displayMode === 'score' ? scoreRanked() : groupedCollection()).filter(c => elemMode === 'start' ? starts(c) : c.elements.some(x => x[0] === el[0]));
    root.innerHTML = `<div class="toolbar"><strong>${el[1]} finds, ${displayMode === 'score' ? 'highest score' : 'rarest'} first</strong><span class="stat">${list.length} found</span><button class="ghost" id="elemModeBtn">${elemMode === 'start' ? 'Formula starts with ' + el[0] : 'Formula contains ' + el[0]}</button></div><div class="rank-list" id="elemGrid"></div>`;
    $('elemModeBtn').onclick = () => {
        elemMode = elemMode === 'start' ? 'contains' : 'start';
        renderElemCompounds();
    };
    const g = $('elemGrid');
    if (!list.length) {
        g.innerHTML = `<div class="empty" style="grid-column:1/-1">${found ? 'Nothing found yet that matches.' : 'Discover this element to see its compounds here.'}</div>`;
        return;
    }
    list.forEach((c, i) => g.appendChild(rankRow(c, i + 1)));
}
$('elemBack').addEventListener('click', () => go(elemReturn || 'inventory'));
$('achievementSearch').addEventListener('input', renderAchievements);
$('achievementFilter').addEventListener('change', renderAchievements);
// shrink an element's font so text fits in room pixels
function fitText(el, text, room, base) {
    const cs = getComputedStyle(el);
    const b = base || parseFloat(cs.fontSize) || 80;
    const m = fitText.c || (fitText.c = document.createElement('canvas').getContext('2d'));
    m.font = cs.fontWeight + ' ' + b + 'px ' + cs.fontFamily;
    const w = m.measureText(text).width;
    el.style.fontSize = (w > room ? Math.max(9, b * room / w) : b) + 'px';
}
const MR_TIER_COL = ['rgba(232,239,233,.35)', '#7cc8ff', '#5eead4', '#b39dff', '#f78fd8', '#ffd166', '#ff9a5c', '#ff5d7a', '#c9b8ff', '#fff6d6', '#3ff0ff', '#c45cff', '#ffd36e'];
// multiroll: show one roll large with its details; the strip picks which
function showMultiRoll(col, records, i, best, swap) {
    const r = records[i];
    const main = col.querySelector('.mr-main');
    const card = col.querySelector('.result-card');
    const reel = col.querySelector('.reel');
    const shown = withIon(r.formula, r.ion);
    if (swap && main.textContent !== shown) {
        main.classList.remove('swap');
        void main.offsetWidth;
        main.classList.add('swap');
    }
    main.textContent = shown;
    fitText(main, shown, reel.clientWidth - 48, parseFloat(getComputedStyle(reel).getPropertyValue('--mr-fs')) || undefined);
    col.querySelectorAll('.mr-chip').forEach((c, k) => c.classList.toggle('sel', k === i));
    card.querySelector('.eyebrow').textContent = `Roll ${i + 1} of ${records.length}` + (i === best ? ' · best' : '');
    card.querySelector('.result-name').textContent = r.name + (r.ion ? ' ' + ionText(r.ion) + ' ion' : '');
    card.querySelector('.rarity').textContent = rarityWord() + ' ' + rarityShown(r);
    card.querySelector('.sub').textContent = $('chainSetting').value === 'off' ? '' : r.elements.length > 1 ? `${r.elements.length} elements chained` : 'No chain';
    col._mr = { records, best };
}
$('rollResults').addEventListener('click', e => {
    const c = e.target.closest('.mr-chip');
    const col = c && c.closest('.roll-result-column');
    if (!c || !col || !col._mr || col.querySelector('.reel.rolling')) {
        return;
    }
    showMultiRoll(col, col._mr.records, +c.dataset.i, col._mr.best, true);
});
async function doRoll(preset, opts) {
    const pre = Array.isArray(preset) ? preset : null;
    const replay = !!(opts && opts.replay);
    if (rolling) {
        return;
    }
    rolling = true;
    stopPageFx();
    $('rollBtn').disabled = true;
    $('rollBtn').textContent = 'Rolling…';
    $('rollToast').textContent = '';
    const buffs = activeBuffStats();
    const rollCount = pre ? pre.length : 1 + buffs.extra;
    const delay = Math.max(300, 3000 / (1 + buffs.speed / 100));
    const results = $('rollResults');
    results.innerHTML = '';
    results.style.gridTemplateColumns = rollCount > 1 ? '1fr' : 'repeat(1,minmax(0,1fr))';
    const multi = rollCount > 1;
    const cardHtml = () => `<div class="result-card"><div class="eyebrow">${multi ? `${rollCount} rolls` : ''}</div><h2 class="result-name">Rolling…</h2><div class="rarity">&nbsp;</div><div class="sub"></div></div>`;
    const col = document.createElement('div');
    col.className = 'roll-result-column';
    col.innerHTML = !multi ? `<div class="reel rolling"><div class="reel-symbol">?</div></div>${cardHtml()}` : `<div class="reel rolling multi"><div class="reel-symbol mr-main">?</div><div class="mr-strip">${Array.from({ length: rollCount }, (_, k) => `<button type="button" class="mr-chip" data-i="${k}" style="--k:${k}"><b>?</b><span>&nbsp;</span></button>`).join('')}</div></div>${cardHtml()}`;
    results.appendChild(col);
    const reel = col.querySelector('.reel');
    const syms = [...col.querySelectorAll('.reel-symbol')];
    const chips = [...col.querySelectorAll('.mr-chip')];
    const cards = [...col.querySelectorAll('.result-card')];
    let records = [];
    const drops = [];
    try {
        const onRoll = $('game').classList.contains('active');
        if (onRoll) {
            startRollTicks();
        }
        const scripted = !pre && tutTake();
        // before it counts down
        const evNow = pre || scripted ? null : eventNow();
        const rolls = pre || Array.from({ length: rollCount }, () => {
            // the catalysts behind this roll, noted before single-roll ones are used up
            const timed = activeList().filter(x => x.a.rolls == null && x.c).map(x => x.c.name);
            const ch = takeRollCharge();
            let luckUp = ch.rollLuck;
            let first = null;
            if (ch.unfound) {
                const found = discoveredSymbols();
                if (ELEMENTS.some(e => !found.has(e[0]))) {
                    first = weightedElement(luckUp, e => !found.has(e[0]));
                } else {
                    luckUp += 3000;
                }
            }
            // inside joke
            if (!first && ch.jokeNew && jokesOn()) {
                const jf = jokesFound();
                if (JOKES.some(j => !jf.has(j[0]))) {
                    first = weightedElement(luckUp, e => isJoke(e[0]) && !jf.has(e[0]));
                }
            }
            const denom = evNow === 'collider' ? 2 : ch.chain3 ? Math.min(3, buffs.chainDenom) : buffs.chainDenom;
            const make = () => rollElements(luckUp, first, { denom, linked: ch.linked, magnet: ch.magnet });
            const elements = scripted ? [elementBySymbol[scripted]] : evNow === 'hole' || ch.twice ? rollTwice(make) : make();
            if (elements.some(e => isJoke(e[0]))) {
                gagHit();
            }
            const formula = hillFormula(elements);
            const log = exactRarity(elements, 0);
            return ionise({
                elements, formula, log, rarity: rarityText(log), score: rollScore(elements), cats: timed.concat(ch.used)
            }, rollIon());
        });
        const ev = pre || scripted ? null : eventsPress(rolls.length);
        const storm = ev && !ev.ev ? ev : null;
        const bestIdx = rolls.reduce((bi, r, i) => r.score > rolls[bi].score ? i : bi, 0);
        const secret = !replay && getRarityTier(rolls[bestIdx].score) >= 5 && Math.random() < secretChance();
        const cut = pickCutscene(rolls);
        // a cutscene always plays on the roll screen, so a rare roll found elsewhere takes you there
        if (cut && !$('game').classList.contains('active')) {
            go('game');
        }
        // multiroll: the cutscene roll, or else the highest score, is shown large; the rest sit in the strip
        const feat = cut ? cut.idx : bestIdx;
        let targets = null;
        if (multi) {
            reel.style.setProperty('--mr-fs', getComputedStyle(syms[0]).fontSize);
            fitText(syms[0], withIon(rolls[feat].formula, rolls[feat].ion), reel.clientWidth - 48);
            chips.forEach((c, i) => fitText(c.querySelector('b'), withIon(rolls[i].formula, rolls[i].ion), c.clientWidth - 10, 18));
            const rr = reel.getBoundingClientRect();
            const mid = el => {
                const q = el.getBoundingClientRect();
                return { x: q.left + q.width / 2 - rr.left, y: q.top + q.height / 2 - rr.top, fs: parseFloat(el.style.fontSize) };
            };
            targets = rolls.map((r, i) => mid(i === feat ? syms[0] : chips[i].querySelector('b')));
        }
        if (cut) {
            stopRollTicks();
            await playCutscene(cut.sym, reel, multi ? [withIon(rolls[feat].formula, rolls[feat].ion)] : rolls.map(r => withIon(r.formula, r.ion)), multi ? 0 : cut.idx, syms);
        } else {
            playBuildup(onRoll ? Math.max(...rolls.map(r => getRarityTier(r.score))) : 0, (Math.max(120, 1350 * delay / 3000) + 1650) / 1000);
            await scanField(reel, syms, rolls.map(r => withIon(r.formula, r.ion)), rolls.map(r => r.score), delay, targets, evNow);
        }
        reel.classList.remove('rolling');
        reel.classList.add('reveal');
        if (cut) {
            reel.classList.add('cut');
        }
        rolls.forEach((r, i) => {
            const { elements, formula, log, rarity, score } = r;
            const card = cards[multi ? 0 : i];
            const names = elements.map(e => e[1]);
            const known = ACHIEVEMENTS.find(a => a.hill === formula);
            const name = elements.length === 1 ? elements[0][1] : (known ? known.name : names.join(' + '));
            const record = {
                id: Date.now() + Math.random(), formula, name, elements, rarity, log, score, when: new Date().toISOString(), cats: r.cats
            };
            if (r.ion) {
                Object.assign(record, { ion: r.ion, baseLog: r.baseLog, baseScore: r.baseScore });
            }
            records.push(record);
            if (!pre) {
                ionCredit(elements[0][0], record.ion);
                addRecord(record);
                addHistory(record, totalRolls());
                save();
                checkAchievements(record);
                globalConsider(record);
            }
            if (multi) {
                const c = chips[i];
                c.querySelector('b').textContent = withIon(formula, record.ion);
                c.querySelector('span').textContent = rarityShown(record);
                c.style.setProperty('--tc', MR_TIER_COL[getRarityTier(score)]);
                c.classList.toggle('feat', i === feat);
                c.classList.toggle('best', i === bestIdx);
            } else {
                syms[i].textContent = withIon(formula, record.ion);
                card.querySelector('.result-name').textContent = name + (record.ion ? ' ' + ionText(record.ion) + ' ion' : '');
                card.querySelector('.rarity').textContent = rarityWord() + ' ' + rarityShown(record);
                card.querySelector('.sub').textContent = $('chainSetting').value === 'off' ? '' : elements.length > 1 ? `${elements.length} elements chained` : 'No chain';
            }
            if (onRoll || cut || getRarityTier(score) > 0) {
                playResultChime(score, secret && i === bestIdx);
            }
            if (!pre) {
                addQuarks(quarksFor(score, quarkMult(elements, buffs)) + (storm && storm.add ? storm.add[i] : 0));
                const d = rollDrop();
                if (d) {
                    drops.push(d);
                }
            }
        });
        drops.forEach((id, k) => showDrop(id, k));
        if (multi) {
            showMultiRoll(col, records, feat, bestIdx, false);
        }
        renderHistory();
        if ($('bonds').classList.contains('active')) {
            bondSummary();
            netDrawSoon();
        }
        if ($('catinv').classList.contains('active')) {
            renderCatInv();
        }
        triggerRarityEffect(rolls[bestIdx], secret);
        if (!replay) {
            const t = getRarityTier(rolls[bestIdx].score);
            if (cut) {
                seenAdd('cut', cut.sym);
            }
            if (t && rarityEffects[t] !== false) {
                seenAdd(secret && t >= 5 ? 'dark' : 'fx', t);
            }
        }
        stopRollTicks();
        $('rollToast').textContent = '';
        if (ev && ev.ev) {
            renderQStorm();
            const E = EVENTS[ev.ev];
            if (ev.started) {
                showAchievementToast({ kicker: 'Event', name: E.name, flavor: 'For the next ' + evRun.left + ' rolls, ' + E.what + '.' });
            } else if (ev.ended) {
                showAchievementToast({ kicker: 'Event over', name: E.name, flavor: 'Rolling is back to normal.' });
            }
        }
        if (storm) {
            renderQStorm(storm.sum);
            if (storm.started) {
                showAchievementToast({ kicker: 'Event', name: 'Quark Storm', flavor: 'For the next ' + qStorm.left + ' rolls, every roll earns ' + qStormRange().join(' to ') + ' extra quarks.' });
            } else if (storm.ended) {
                showAchievementToast({ kicker: 'Quark Storm over', name: '+' + formatNumber(Math.round(storm.ended)) + ' quarks', flavor: 'The storm has passed. That is what it added on top of your usual quarks.' });
            }
        }
        renderInventory();
        renderPeriodic();
        applyCosmetics();
        if (!buffs.autoUnlocked && activeBuffStats().autoUnlocked) {
            setTimeout(() => showAchievementToast({
                kicker: 'New feature', name: 'Autoroll unlocked', flavor: elementBySymbol[AUTO_UNLOCK_SYMBOL][1] + ' discovered: autoroll is now available on the roll screen, and stays on until you switch it off.'
            }), 1800);
        }
    } finally {
        stopRollTicks();
        rolling = false;
        $('rollBtn').disabled = false;
        $('rollBtn').textContent = 'Roll again';
    }
}
$('rollBtn').addEventListener('click', doRoll);
function fmtDur(s) {
    s = Math.max(0, Math.ceil(s));
    return Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0');
}
// autoroll: once unlocked it stays on until switched off, with a break between rolls.
// It runs while the roll screen is open and waits while you are on another screen.
let autoWanted = false;
let autoFrom = 0;
const autoNext = () => autoFrom ? autoFrom + activeBuffStats().autoGap * 1000 : 0;
try {
    autoWanted = localStorage.getItem('elementalAutoOn') === '1';
} catch (e) { }
function saveAutoState() {
    try {
        localStorage.setItem('elementalAutoOn', autoWanted ? '1' : '');
        localStorage.removeItem('elementalAutoState');
    } catch (e) { }
}
const fmtGap = s => s < 10 ? s.toFixed(1) + 's' : fmtDur(s);
function updateAutoBtn() {
    const b = $('autoRollBtn');
    const hint = $('autoHint');
    const s = activeBuffStats();
    const u = elementBySymbol[AUTO_UNLOCK_SYMBOL];
    let label;
    let status;
    let disabled = false;
    if (!s.autoUnlocked) {
        label = 'Autoroll locked';
        status = 'Locked';
        disabled = true;
        hint.textContent = 'Autoroll unlocks when you find ' + u[1] + ' (' + u[0] + ').';
    } else {
        const onMenu = $('menu').classList.contains('active');
        hint.textContent = `Autoroll keeps rolling with a ${fmtGap(s.autoGap)} break between rolls${s.autoGap <= AUTO_MIN_GAP ? ' (its fastest)' : ''}. It keeps going on every screen except the main menu.`;
        if (!autoWanted) {
            label = 'Autoroll off';
            status = 'Off';
        } else if (onMenu) {
            label = 'Autoroll on';
            status = 'Paused on the main menu';
        } else if (rolling || !autoFrom) {
            label = 'Autoroll on';
            status = 'On, rolling';
        } else {
            const left = Math.max(0, (autoNext() - Date.now()) / 1000);
            label = 'Autoroll on · ' + fmtGap(left);
            status = 'On, next roll in ' + fmtGap(left);
        }
    }
    b.disabled = disabled;
    b.textContent = label;
    b.setAttribute('aria-pressed', autoWanted && s.autoUnlocked ? 'true' : 'false');
    b.classList.toggle('auto-on', autoWanted && s.autoUnlocked);
    document.querySelectorAll('.js-auto').forEach(el => {
        el.textContent = status;
    });
}
async function autoLoop() {
    if (autoRolling) {
        return;
    }
    autoRolling = true;
    try {
        while (autoWanted && activeBuffStats().autoUnlocked) {
            if ($('menu').classList.contains('active') || rolling || document.getElementById('dlg')) {
                autoFrom = 0;
                await new Promise(r => setTimeout(r, 250));
                continue;
            }
            if (!autoFrom) {
                autoFrom = Date.now();
            }
            if (Date.now() < autoNext()) {
                updateAutoBtn();
                await new Promise(r => setTimeout(r, Math.max(16, Math.min(250, autoNext() - Date.now()))));
                continue;
            }
            autoFrom = 0;
            await doRoll();
            autoFrom = Date.now();
        }
    } catch (err) {
        console.error('Autoroll stopped after an error:', err);
    } finally {
        autoRolling = false;
        autoFrom = 0;
        updateAutoBtn();
    }
}
$('autoRollBtn').addEventListener('click', () => {
    if (!activeBuffStats().autoUnlocked) {
        return;
    }
    autoWanted = !autoWanted;
    saveAutoState();
    // first roll after switching on comes after one break, like every other
    autoFrom = 0;
    updateAutoBtn();
    if (autoWanted) {
        autoLoop();
    }
});
setInterval(updateAutoBtn, 250);
updateAutoBtn();
if (autoWanted) {
    autoLoop();
}
$('resetBtn').addEventListener('click', () => {
    if (confirm('Reset all discoveries and collection progress? This cannot be undone.')) {
        autoRolling = false;
        autoWanted = false;
        try {
            localStorage.removeItem('elementalAutoState');
            localStorage.removeItem('elementalBonds2');
            netState = {};
            netVer++;
            localStorage.removeItem('elementalNetwork');
            localStorage.removeItem('elementalShop');
            localStorage.removeItem('elementalCatInv');
            localStorage.removeItem('elementalCatActive');
            localStorage.removeItem('elementalCatFlags');
            localStorage.removeItem('elementalIons');
            localStorage.removeItem('elementalJokeIntro');
            shopState = { slot: -1, stock: [] };
            catInv = {};
            catActive = {};
            catFlags = {};
            ionMarks = {};
            ionNew = [];
            qStorm = null;
            qStormSave();
            evRun = null;
            evSave();
            localStorage.removeItem('elementalCosmetics');
            cosState = { owned: [], scanner: '', page: '', effects: '', badge: true };
            applyCosmetics();
            buffCache = weightCache = null;
        } catch (e) { }
        collection = [];
        save();
        quarks = 0;
        try {
            localStorage.removeItem('elementalQuarks');
            localStorage.removeItem('elementalHistory');
            localStorage.removeItem('elementalCleared');
            localStorage.removeItem('elementalSeen');
            seenData = null;
            clearCleared = { rolls: 0, formulas: 0 };
        } catch (e) { }
        renderQuarks();
        rollHistory = [];
        renderHistory();
        updateAutoBtn();
        unlockedAchievements = [];
        try {
            localStorage.removeItem('elementalAchievements');
        } catch (e) { }
        syncEffectSettings();
        renderInventory();
        renderPeriodic();
        renderAchievements();
        $('rollResults').style.gridTemplateColumns = '';
        $('rollResults').innerHTML = INITIAL_RESULT;
        alert('Progress reset.');
    }
});
renderInventory();
renderPeriodic();
renderAchievements();
function parseFormula(s) {
    const st = [{}];
    const re = /([A-Z][a-z]?)(\d*)|(\()|\)(\d*)/g;
    let m;
    while (m = re.exec(s)) {
        if (m[1]) {
            const c = st[st.length - 1];
            c[m[1]] = (c[m[1]] || 0) + (+m[2] || 1);
        } else if (m[3]) {
            st.push({});
        } else {
            const t = st.pop();
            const k = +m[4] || 1;
            const c = st[st.length - 1];
            for (const x in t) {
                c[x] = (c[x] || 0) + t[x] * k;
            }
        }
    }
    return st[0];
}
function normalizeFormula(f) {
    const c = parseFormula(f);
    const a = [];
    for (const x in c) {
        for (let i = 0; i < c[x]; i++) {
            a.push([x]);
        }
    }
    return hillFormula(a);
}
ACHIEVEMENTS.forEach(a => a.hill = normalizeFormula(a.formula));
function assignAchievementRarities() {
    const weights = ELEMENTS.map(e => (1 / e[2]) * (1 + 1.5 * (Math.log10(e[2] + 1) / 3)));
    const totalWeight = weights.reduce((sum, w) => sum + w, 0);
    const chainChance = 1 / 3;

    const logFactorial = n => {
        let total = 0;
        for (let i = 2; i <= n; i++) {
            total += Math.log(i);
        }
        return total;
    };

    function estimatedRolls(formula) {
        const counts = parseFormula(formula);
        const symbols = Object.keys(counts);
        const length = symbols.reduce((sum, symbol) => sum + counts[symbol], 0);
        if (length > 30) {
            return Infinity;
        }
        let logProbability = logFactorial(length);
        if (length < 30) {
            logProbability += (length - 1) * Math.log(chainChance) + Math.log(1 - chainChance);
        } else {
            logProbability += 29 * Math.log(chainChance);
        }
        symbols.forEach(symbol => {
            const weight = weights[ELEMENTS.findIndex(e => e[0] === symbol)];
            logProbability += counts[symbol] * Math.log(weight / totalWeight) - logFactorial(counts[symbol]);
        });
        return Math.exp(-logProbability);
    }

    ACHIEVEMENTS.forEach(a => {
        const rolls = estimatedRolls(a.formula);
        if (rolls < 2e3) a.rarity = 'Common';
        else if (rolls < 2e4) a.rarity = 'Uncommon';
        else if (rolls < 2e5) a.rarity = 'Rare';
        else if (rolls < 2e6) a.rarity = 'Epic';
        else a.rarity = 'Legendary';
    });

    unlockedAchievements = unlockedAchievements.filter(formula => ACHIEVEMENTS.some(a => a.formula === formula));
    document.querySelector('#achievements .sub').textContent = ACHIEVEMENTS.length + ' formulas to find. Each is recorded the first time you roll it.';
    renderAchievements();
}
assignAchievementRarities();
document.addEventListener('keydown', e => {
    if (e.code === 'Space' && $('game').classList.contains('active') && !/INPUT|SELECT|TEXTAREA|BUTTON/.test(document.activeElement.tagName)) {
        e.preventDefault();
        doRoll();
    }
});
try {
    $('chainSetting').value = localStorage.getItem('elementalChain') || 'on';
} catch (e) { }
$('appVersion').textContent = 'Jamiemek - Elemental - version ' + APP_VERSION;
function applyTheme(t) {
    const dark = t === 'dark' || (t === 'system' && window.matchMedia && matchMedia('(prefers-color-scheme: dark)').matches);
    document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
}
let themePref = 'light';
try {
    themePref = localStorage.getItem('elementalTheme') || 'light';
} catch (e) { }
$('themeSetting').value = themePref;
$('themeSetting').onchange = () => {
    themePref = $('themeSetting').value;
    try {
        localStorage.setItem('elementalTheme', themePref);
    } catch (e) { }
    applyTheme(themePref);
};
if (window.matchMedia) {
    const mq = matchMedia('(prefers-color-scheme: dark)');
    const onSys = () => themePref === 'system' && applyTheme('system');
    mq.addEventListener ? mq.addEventListener('change', onSys) : mq.addListener(onSys);
}
try {
    calmFx = localStorage.getItem('elementalCalm') === '1';
} catch (e) { }
$('calmSetting').checked = calmFx;
$('calmSetting').onchange = () => {
    calmFx = $('calmSetting').checked;
    try {
        localStorage.setItem('elementalCalm', calmFx ? '1' : '0');
    } catch (e) { }
};
$('displaySetting').value = displayMode;
$('displaySetting').onchange = () => {
    displayMode = $('displaySetting').value === 'score' ? 'score' : 'odds';
    try {
        localStorage.setItem('elementalDisplay', displayMode);
    } catch (e) { }
    renderInventory();
    renderPeriodic();
    renderHistory();
};
renderQuarks();
renderQStorm();
renderHistory();
try {
    $('bonusFold').open = localStorage.getItem('elementalBonusOpen') === 'true';
} catch (e) { }
$('bonusFold').addEventListener('toggle', () => {
    try {
        localStorage.setItem('elementalBonusOpen', $('bonusFold').open ? 'true' : 'false');
    } catch (e) { }
});
$('chainSetting').onchange = () => {
    try {
        localStorage.setItem('elementalChain', $('chainSetting').value);
    } catch (e) { }
};
syncEffectSettings();
try {
    localStorage.removeItem('elementalStock');
} catch (e) { }
bondSummary();
renderActiveCats();
// tiers 10-12 only show once you've reached them
const tierTop = () => collection.reduce((m, c) => Math.max(m, getRarityTier(c.score)), Math.max(0, ...seenLoad().fx));
function tierRowsSync() {
    const top = tierTop();
    document.querySelectorAll('.tier-table tbody tr').forEach((tr, i) => tr.hidden = i >= 9 && i + 1 > top);
    $('tier9Top').textContent = top >= 10 ? 'to 30,000,000' : 'and above';
}
function jokeUiSync() {
    $('jokeSetting').hidden = !jokesOn();
    $('jokeMixSet').checked = jokeMix;
    $('jokeHideSet').checked = jokeHide;
}
function jokeSetMix(on) {
    jokeMix = on;
    try {
        localStorage.setItem('elementalJokeMix', on ? '1' : '0');
    } catch (e) { }
    weightCache = null;
}
$('jokeMixSet').addEventListener('change', () => jokeSetMix($('jokeMixSet').checked));
$('jokeHideSet').addEventListener('change', () => {
    jokeHide = $('jokeHideSet').checked;
    try {
        localStorage.setItem('elementalJokeHide', jokeHide ? '1' : '');
    } catch (e) { }
    if (typeof globalLoad === 'function') {
        globalLoad();
    }
});
// first unlock popup
function jokeIntroCheck() {
    let seen = true;
    try {
        seen = localStorage.getItem('elementalJokeIntro') === '1';
    } catch (e) { }
    if (seen || !jokesOn()) {
        return;
    }
    if (document.getElementById('dlg') || rolling) {
        setTimeout(jokeIntroCheck, 1500);
        return;
    }
    try {
        localStorage.setItem('elementalJokeIntro', '1');
    } catch (e) { }
    const w = openDialog('<h2>The joke periodic table</h2><p>' + JOKES.length + ' new elements are now in the pool, every one rarer than Uranium. Find them on the joke table in your Collection.</p>' +
        '<p>Mixing is on: joke elements can chain with real ones into joke compounds. You can turn it off now, or any time in Settings.</p>' +
        '<div class="btn-row"><button class="primary" id="jokeKeep">Keep mixing on</button><button class="ghost" id="jokeOff">Turn mixing off</button></div>');
    w.querySelector('#jokeKeep').onclick = closeDialog;
    w.querySelector('#jokeOff').onclick = () => {
        jokeSetMix(false);
        closeDialog();
    };
    if (typeof globalLoad === 'function') {
        globalLoad();
    }
}
setTimeout(jokeIntroCheck, 2500);
// cosmetics
const COSMETICS = [
    { id: 'oscilloscope', kind: 'scanner', name: 'Oscilloscope', desc: 'Green phosphor, a graticule and a live trace.', price: 25000 },
    { id: 'holographic', kind: 'scanner', name: 'Holographic', desc: 'Iridescent, with colour fringes and a sweeping shimmer.', price: 60000 },
    { id: 'warp', kind: 'scanner', name: 'Warp', desc: 'The field streams past at warp speed.', free: 'Zo' },
    { id: 'blueprint', kind: 'page', name: 'Blueprint', desc: 'White on drafting blue, on a fine grid.', price: 40000 },
    { id: 'notebook', kind: 'page', name: 'Lab notebook', desc: 'Ruled paper, a margin line and ink.', price: 90000 },
    { id: 'gameover', kind: 'page', name: 'Game Over', desc: 'Black, red and a CRT glow.', free: 'Gg' },
    { id: 'retro', kind: 'effects', name: 'Retro spawn effects', desc: 'All 12 rarity effects redone in 8-bit: pixels, coins, fireworks and a CRT.', price: 120000 },
    { id: 'astral', kind: 'effects', name: 'Astral spawn effects', desc: 'All 12 rarity effects redone among the stars: constellations, comets, eclipses and galaxies.', price: 200000 }
];
const COS = Object.fromEntries(COSMETICS.map(c => [c.id, c]));
const COS_KINDS = { scanner: 'Scanner', page: 'Page', effects: 'Spawn effects' };
let cosState = { owned: [], scanner: '', page: '', effects: '', badge: true };
try {
    cosState = Object.assign(cosState, JSON.parse(localStorage.getItem('elementalCosmetics') || '{}'));
} catch (e) { }
function cosSave() {
    try {
        localStorage.setItem('elementalCosmetics', JSON.stringify(cosState));
    } catch (e) { }
}
const cosUnlocked = id => bondBonus().cos.includes(id);
const cosOwned = id => cosUnlocked(id) && (!!COS[id].free || cosState.owned.includes(id));
const hasFinalBadge = () => cosUnlocked('gameover');
const effectSkin = () => cosState.effects && cosOwned(cosState.effects) ? cosState.effects : '';
const scannerSkin = () => cosState.scanner && cosOwned(cosState.scanner) ? cosState.scanner : '';
function applyCosmetics() {
    // toast new unlocks
    const un = bondBonus().cos;
    if (!cosState.seen) {
        cosState.seen = un.slice();
        cosSave();
    }
    const fresh = un.filter(id => !cosState.seen.includes(id));
    if (fresh.length) {
        cosState.seen = cosState.seen.concat(fresh);
        cosSave();
        setTimeout(() => showAchievementToast({ kicker: 'Cosmetic unlocked', name: fresh.length > 2 ? fresh.length + ' new cosmetics' : fresh.map(id => COS[id].name + ({ page: ' page', scanner: ' scanner' }[COS[id].kind] || '')).join(' and '), flavor: 'Find it on the Cosmetics tab of the shop.' }), 1500);
    }
    const root = document.documentElement;
    const page = cosState.page && cosOwned(cosState.page) ? cosState.page : '';
    const scan = scannerSkin();
    if (page) {
        root.setAttribute('data-skin', page);
    } else {
        root.removeAttribute('data-skin');
    }
    if (scan) {
        root.setAttribute('data-scanner', scan);
    } else {
        root.removeAttribute('data-scanner');
    }
    const badge = $('finalBadge');
    if (badge) {
        badge.hidden = !(hasFinalBadge() && cosState.badge);
    }
    const tabs = $('shopTabs');
    if (tabs) {
        tabs.hidden = !bondBonus().cos.length;
        if (tabs.hidden) {
            shopTab('cats');
        }
    }
}
function shopTab(t) {
    document.querySelectorAll('[data-stab]').forEach(b => b.classList.toggle('active', b.dataset.stab === t));
    $('shopCats').hidden = t !== 'cats';
    $('cosPanel').hidden = t !== 'cos';
    if (t === 'cos') {
        renderCosmetics();
    }
}
function renderCosmetics() {
    const grid = $('cosGrid');
    if (!grid) {
        return;
    }
    const un = bondBonus().cos;
    const list = COSMETICS.filter(c => un.includes(c.id));
    const card = c => {
        let btn;
        if (!cosOwned(c.id)) {
            btn = `<button class="primary cos-buy" data-id="${c.id}"${quarks < c.price ? ' disabled' : ''}><span class="q-sym">q</span> ${c.price.toLocaleString('en-US')}</button>`;
        } else if (cosState[c.kind] === c.id) {
            btn = `<button class="ghost cos-use on" data-id="${c.id}">In use · take off</button>`;
        } else {
            btn = `<button class="primary cos-use" data-id="${c.id}">Use</button>`;
        }
        const how = c.free ? `<p class="cat-len">Free: unlocked by ${elementBySymbol[c.free][1]}</p>` : '';
        return `<article class="cat-card cos-card${cosState[c.kind] === c.id ? ' held' : ''}" style="--tc:var(--hazard)"><div class="cos-swatch sw-${c.id}" aria-hidden="true"></div><span class="cos-kind">${COS_KINDS[c.kind]}</span><h3>${c.name}</h3><p>${c.desc}</p>${how}${btn}</article>`;
    };
    let html = list.map(card).join('');
    if (hasFinalBadge()) {
        html += `<article class="cat-card cos-card${cosState.badge ? ' held' : ''}" style="--tc:var(--hazard)"><div class="cos-swatch sw-badge" aria-hidden="true"><span class="final-badge">Final Element</span></div><span class="cos-kind">Badge</span><h3>Final Element</h3><p>Shown by your quarks. For finding ${elementBySymbol.Gg[1]}.</p><button class="${cosState.badge ? 'ghost on' : 'primary'} cos-badge">${cosState.badge ? 'Shown · hide' : 'Show'}</button></article>`;
    }
    grid.innerHTML = html || '<p class="muted">No cosmetics unlocked yet.</p>';
}
$('cosGrid').addEventListener('click', e => {
    const buy = e.target.closest('.cos-buy');
    const use = e.target.closest('.cos-use');
    const msg = $('cosMsg');
    msg.textContent = '';
    if (buy) {
        const c = COS[buy.dataset.id];
        if (!cosUnlocked(c.id) || cosOwned(c.id)) {
            return;
        }
        if (quarks < c.price) {
            msg.textContent = 'Not enough quarks.';
            return;
        }
        addQuarks(-c.price);
        cosState.owned.push(c.id);
        cosState[c.kind] = c.id;
        msg.textContent = c.name + ' bought and in use.';
    } else if (use) {
        const c = COS[use.dataset.id];
        cosState[c.kind] = cosState[c.kind] === c.id ? '' : c.id;
    } else if (e.target.closest('.cos-badge')) {
        cosState.badge = !cosState.badge;
    } else {
        return;
    }
    cosSave();
    applyCosmetics();
    renderCosmetics();
});
document.querySelectorAll('[data-stab]').forEach(b => b.addEventListener('click', () => shopTab(b.dataset.stab)));
applyCosmetics();
const TAU = Math.PI * 2;
const CUTSCENES = {};
const clamp = (x, min = 0, max = 1) => Math.min(max, Math.max(min, x));
const smoothstep = (edge0, edge1, x) => {
    x = clamp((x - edge0) / (edge1 - edge0));
    return x * x * (3 - 2 * x);
};
const easeOutCubic = x => 1 - Math.pow(1 - clamp(x), 3);
const CUTSCENE_FONT = 'Bahnschrift,"DIN Alternate","Arial Narrow",Arial,sans-serif';
const seededRandom = seed => () => {
    seed |= 0;
    seed = seed + 0x6D2B79F5 | 0;
    let t = Math.imul(seed ^ seed >>> 15, 1 | seed);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
};
function drawGlow(ctx, x, y, radius, color, alpha) {
    if (calmFx) {
        alpha = Math.min(alpha, 0.5);
    }
    if (alpha <= 0.003 || radius <= 0) {
        return;
    }
    const q = ctx.createRadialGradient(x, y, 0, x, y, radius);
    q.addColorStop(0, color);
    q.addColorStop(1, color + '00');
    ctx.globalAlpha = clamp(alpha);
    ctx.fillStyle = q;
    ctx.fillRect(x - radius, y - radius, 2 * radius, 2 * radius);
    ctx.globalAlpha = 1;
}
function drawText(ctx, text, x, y, size, color, alpha, weight = 700, spacing = 0) {
    if (alpha <= 0.003) {
        return;
    }
    ctx.save();
    ctx.globalAlpha = clamp(alpha);
    ctx.fillStyle = color;
    ctx.font = weight + ' ' + size + 'px ' + CUTSCENE_FONT;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    if ('letterSpacing' in ctx) {
        ctx.letterSpacing = spacing + 'px';
    }
    ctx.fillText(text, x, y);
    ctx.restore();
}
function drawCard(ctx, scene, time, start, color, color2) {
    scene.cardStart = start;
    scene.cardColor = color;
    scene.cardColor2 = color2;
    const a = smoothstep(start, start + 900, time);
    const u = scene.unit;
    const W = scene.width;
    const H = scene.height;
    if (!a) {
        return;
    }
    drawGlow(ctx, W / 2, H / 2, 60 * u, color2, 0.4 * a);
    if (!scene.domText) {
        drawText(ctx, scene.sym, W / 2, H / 2 - 2 * u, 26 * u * (0.92 + 0.08 * a), color, a, 800);
    }
    drawText(ctx, scene.name.toUpperCase(), W / 2, H / 2 + 17 * u, 3.6 * u, '#fff', a * 0.9, 600, 0.9 * u);
    drawText(ctx, scene.atomicNumber ? 'ELEMENT ' + scene.atomicNumber : 'JOKE ELEMENT', W / 2, H / 2 - 24 * u, 2.2 * u, color, a * 0.85, 600, 0.6 * u);
}
// Picks the rarest roll that contains an element with its own cutscene.
function pickCutscene(rolls) {
    let best = null;
    rolls.forEach((r, i) => {
        const hit = r.elements.filter(e => CUTSCENES[e[0]]).sort((a, b) => b[2] - a[2])[0];
        if (hit && (!best || r.log < best.log)) {
            best = { sym: hit[0], log: r.log, idx: i };
        }
    });
    return best;
}
function playCutscene(sym, reel, forms, idx, syms) {
    return new Promise(resolve => {
        const cutscene = CUTSCENES[sym];
        const VW = innerWidth;
        const VH = innerHeight;
        const margin = 38;
        const frameWidth = Math.max(200, VW - 2 * margin);
        const frameHeight = Math.max(200, VH - 2 * margin);
        const dpr = Math.min(2, devicePixelRatio || 1);
        const r = reel.getBoundingClientRect();
        const overlay = document.createElement('div');
        const veil = document.createElement('div');
        const box = document.createElement('div');
        const canvas = document.createElement('canvas');
        overlay.style.cssText = 'position:fixed;inset:0;z-index:14';
        veil.style.cssText = 'position:absolute;inset:0;background:var(--bench);opacity:0';
        box.className = 'reel';
        box.style.position = 'fixed';
        box.style.margin = '0';
        canvas.width = frameWidth * dpr;
        canvas.height = frameHeight * dpr;
        canvas.style.cssText = 'position:absolute;inset:auto;left:50%;top:50%;width:' + frameWidth + 'px;height:' + frameHeight + 'px;transform:translate(-50%,-50%)';
        box.appendChild(canvas);
        overlay.appendChild(veil);
        overlay.appendChild(box);
        document.body.appendChild(overlay);
        // hide the real roll box while its expanding copy plays, so there aren't two
        reel.style.visibility = 'hidden';
        const N = syms.length;
        const cs = getComputedStyle(syms[0]);
        const fam = cs.fontFamily;
        const m = document.createElement('canvas').getContext('2d');
        const u = Math.min(frameWidth, frameHeight) / 100;
        let fsA = syms.map(() => parseFloat(cs.fontSize) || 80);
        if (N > 1) {
            const base = Math.min(parseFloat(cs.fontSize) || 80, 84);
            m.font = '700 ' + base + 'px ' + fam;
            fsA = forms.map(l => {
                const room = reel.clientWidth / N - 24;
                const tw = m.measureText(l).width;
                return tw > room ? base * room / tw : base;
            });
            syms.forEach((e, i) => e.style.fontSize = fsA[i] + 'px');
        }
        const fx = syms.map(e => {
            const q = e.getBoundingClientRect();
            return [(q.left + q.width / 2 - r.left) / r.width, (q.top + q.height / 2 - r.top) / r.height];
        });
        m.font = '700 100px ' + fam;
        const fsC = Math.min(26 * u, 0.8 * frameWidth / (m.measureText(forms[idx]).width / 100));
        const D = [(fx[idx][0] - 0.5) * r.width, (fx[idx][1] - 0.5) * r.height];
        const RC = [238, 243, 239];
        const YC = [240, 196, 25];
        const rgb = h => [1, 3, 5].map(i => parseInt(h.substr(i, 2), 16));
        const mix = (a, b, k) => a.map((v, i) => Math.round(b[i] + (v - b[i]) * k)).join(',');
        const L = forms.map(f => {
            const d = document.createElement('div');
            d.textContent = f;
            const q = d.style;
            q.position = 'fixed';
            q.left = q.top = '0';
            q.whiteSpace = 'nowrap';
            q.pointerEvents = 'none';
            q.lineHeight = '1';
            q.fontFamily = fam;
            q.fontWeight = cs.fontWeight;
            q.opacity = '0';
            q.transform = 'translate(-50%,-50%)';
            overlay.appendChild(d);
            return d;
        });
        const R = [r.left, r.top, r.width, r.height];
        const F = [margin, margin, frameWidth, frameHeight];
        const ctx = canvas.getContext('2d');
        const scene = {
            sym, name: elementBySymbol[sym][1], atomicNumber: cutscene.z, width: frameWidth, height: frameHeight, unit: u, state: {}, domText: true
        };
        const growMs = 2600;
        const fadeMs = 900;
        const duration = cutscene.dur;
        const t0 = performance.now();
        const c = prepareAudio();
        if (c) {
            try {
                cutscene.snd(c, c.currentTime + 0.05);
            } catch (e) { }
        }
        (function f(now) {
            const el = Math.max(0, now - t0);
            if (el >= duration + fadeMs) {
                reel.style.visibility = '';
                overlay.remove();
                resolve();
                return;
            }
            const k = el < duration ? smoothstep(0, 1, el / growMs) : 1 - smoothstep(0, 1, (el - duration) / fadeMs);
            const bl = R[0] + (F[0] - R[0]) * k;
            const bt = R[1] + (F[1] - R[1]) * k;
            const bw = R[2] + (F[2] - R[2]) * k;
            const bh = R[3] + (F[3] - R[3]) * k;
            box.style.left = bl + 'px';
            box.style.top = bt + 'px';
            box.style.width = bw + 'px';
            box.style.height = bh + 'px';
            veil.style.opacity = k;
            canvas.style.opacity = el < duration ? 1 : smoothstep(0, 0.55, k);
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            ctx.clearRect(0, 0, frameWidth, frameHeight);
            const tt = Math.min(el, duration);
            cutscene.draw(ctx, scene, tt, duration);
            const a = smoothstep(scene.cardStart || 1e9, (scene.cardStart || 1e9) + 900, tt);
            const th = scene.cardColor ? rgb(scene.cardColor) : RC;
            const th2 = scene.cardColor2 ? rgb(scene.cardColor2) : YC;
            L.forEach((d, i) => {
                const q = d.style;
                if (i === idx) {
                    q.left = bl + bw / 2 + D[0] * (1 - k) + 'px';
                    q.top = bt + bh / 2 + (D[1] + (-2 * u - D[1]) * k) + 'px';
                    q.fontSize = fsA[i] + (fsC - fsA[i]) * k + 'px';
                    q.color = 'rgb(' + mix(th, RC, k) + ')';
                    q.textShadow = '0 0 ' + (24 + 36 * k) + 'px rgba(' + mix(th2, YC, k) + ',' + (0.25 + 0.3 * k) + ')';
                    q.opacity = a;
                } else {
                    q.left = bl + fx[i][0] * bw + 'px';
                    q.top = bt + fx[i][1] * bh + 'px';
                    q.fontSize = fsA[i] + 'px';
                    q.color = 'rgb(' + RC + ')';
                    q.textShadow = '0 0 24px rgba(240,196,25,.25)';
                    q.opacity = 1 - smoothstep(0.15, 0.7, k);
                }
            });
            requestAnimationFrame(f);
        })(t0);
    });
}
// U: a neutron starts a fission chain reaction in a reactor core
CUTSCENES.U = {
    z: 92, dur: 10500,
    snd(audio, start) {
        padChord(audio, start, [55, 82.4, 110], 7.4, 0.012, 'sine', 600);
        for (let x = 0.2; x < 7.2;) {
            playNoise(audio, start + x, 0.012, 0.045, 3800, 2000, 'highpass', 1, 0.12, 0.001);
            x += Math.max(0.03, 0.5 * Math.pow(1 - x / 7.6, 2) * (0.4 + Math.random()));
        }
        playTone(audio, 2200, start + 2.6, 0.8, 0.02, 'sine', 200, 0.4);
        [3.4, 4.3, 5.4].forEach(x => boom(audio, start + x, 0.07, 0.9));
        riser(audio, start + 4.6, 2.7, 0.035, 120, 1400);
        boom(audio, start + 7.35, 0.24, 2.4);
        padChord(audio, start + 7.6, [130.8, 196, 261.6, 392], 3, 0.022, 'sine', 2600);
        sparkle(audio, start + 7.8, 9, 2.2, 0.018);
    },
    draw(ctx, scene, time) {
        const width = scene.width;
        const height = scene.height;
        const unit = scene.unit;
        const cx = width / 2;
        const cy = height / 2;
        const state = scene.state;
        if (!state.n) {
            state.n = [[0, 0, 3400, -1]];
            for (let i = 0; i < 4; i++) {
                const a = i * 1.571 + 0.5;
                state.n.push([Math.cos(a) * 20 * unit, Math.sin(a) * 16 * unit, 4300 + i * 140, 0]);
            }
            for (let j = 0; j < 8; j++) {
                const a = j * 0.785 + 0.2;
                state.n.push([Math.cos(a) * 38 * unit, Math.sin(a) * 29 * unit, 5400 + j * 110, 1 + (j >> 1)]);
            }
            const r = seededRandom(92);
            state.p = Array.from({ length: 70 }, () => [r() * width, r() * height, r() * 3 + 1, r()]);
        }
        const w = smoothstep(0, 3000, time);
        const f = smoothstep(6600, 7400, time) * (1 - smoothstep(7400, 8300, time));
        ctx.fillStyle = '#02060c';
        ctx.fillRect(0, 0, width, height);
        drawGlow(ctx, cx, height * 1.05, Math.max(width, height) * 0.85, '#1d63ff', 0.5 * w + 0.25 * smoothstep(3400, 6800, time));
        for (let i = 0; i < 9; i++) {
            const x = width * (0.1 + i * 0.1);
            const h = height * (0.4 + 0.1 * Math.sin(i * 2.1)) * easeOutCubic(w);
            ctx.fillStyle = 'rgba(70,150,255,' + (0.22 + 0.12 * Math.sin(time / 260 + i)) + ')';
            ctx.fillRect(x - 0.5 * unit, height - h, unit, h);
        }
        state.p.forEach(p => {
            const y = ((p[1] - time * p[2] * 0.03) % height + height) % height;
            ctx.fillStyle = 'rgba(150,205,255,' + 0.45 * p[3] * w + ')';
            ctx.beginPath();
            ctx.arc(p[0], y, p[3] * 1.8, 0, TAU);
            ctx.fill();
        });
        let done = 0;
        state.n.forEach(([x, y, ft, par]) => {
            const X = cx + x;
            const Y = cy + y;
            const d = time - ft;
            if (par < 0) {
                const p = smoothstep(2500, 3400, time);
                if (p > 0 && p < 1) {
                    drawNeutron(ctx, cx - (1 - p) * width * 0.6, cy, unit);
                }
            } else {
                const q = state.n[par];
                const p = (time - ft + 520) / 520;
                if (p > 0 && p < 1) {
                    drawNeutron(ctx, cx + q[0] + (x - q[0]) * p, cy + q[1] + (y - q[1]) * p, unit);
                }
            }
            if (d < 0) {
                for (let k = 0; k < 7; k++) {
                    const a = k * 0.9 + time / 500;
                    const r = k ? 2.2 * unit : 0;
                    ctx.fillStyle = k % 2 ? '#c8ff6a' : '#7dffb0';
                    ctx.beginPath();
                    ctx.arc(X + Math.cos(a) * r, Y + Math.sin(a) * r, 1.5 * unit, 0, TAU);
                    ctx.fill();
                }
                drawGlow(ctx, X, Y, 7 * unit, '#9dff5a', 0.35);
            } else {
                done++;
                const m = easeOutCubic(d / 1400) * 9 * unit;
                const al = 1 - smoothstep(0, 2200, d);
                const ang = Math.atan2(y, x || 1) + 1.57;
                drawGlow(ctx, X, Y, 16 * unit, '#b8ff6a', (1 - clamp(d / 800)) * 0.9);
                ctx.strokeStyle = 'rgba(210,255,170,' + (1 - clamp(d / 700)) + ')';
                ctx.lineWidth = 0.5 * unit;
                ctx.beginPath();
                ctx.arc(X, Y, unit * 2 + d / 18, 0, TAU);
                ctx.stroke();
                [-1, 1].forEach(s => {
                    ctx.fillStyle = 'rgba(150,255,120,' + al + ')';
                    ctx.beginPath();
                    ctx.arc(X + Math.cos(ang) * m * s, Y + Math.sin(ang) * m * s, 3.2 * unit * (1 - 0.35 * clamp(d / 2200)), 0, TAU);
                    ctx.fill();
                });
            }
        });
        drawGlow(ctx, cx, cy, Math.max(width, height) * 0.9, '#eaffd2', f);
        drawText(ctx, 'FISSION EVENTS  ' + String(done).padStart(2, '0'), cx, height - 4 * unit, 2 * unit, '#8fd0ff', smoothstep(3000, 3600, time) * (1 - smoothstep(7000, 7600, time)), 600, 0.4 * unit);
        drawCard(ctx, scene, time, 8000, '#d6ff6e', '#2fe07a');
    }
};
function drawNeutron(ctx, x, y, unit) {
    drawGlow(ctx, x, y, 5 * unit, '#ffffff', 0.9);
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(x, y, unit, 0, TAU);
    ctx.fill();
}
// Og: the table counts up to 118, a 119th cell fails, and the last cell floods the screen
CUTSCENES.Og = {
    z: 118, dur: 10000,
    snd(audio, start) {
        for (let i = 0; i < 118; i++) {
            playTone(audio, 420 + i * 7, start + 0.3 + Math.pow(i / 117, 1.6) * 5.6, 0.05, 0.016, 'square', null, 0.1, 0, 0.002);
        }
        playNoise(audio, start + 5.8, 0.3, 0.06, 500, 3500, 'bandpass', 4, 0.3);
        playTone(audio, 95, start + 6.15, 0.7, 0.05, 'sawtooth', 40, 0.1, 0, 0.01);
        playTone(audio, 58, start + 7, 3, 0.03, 'sine', null, 0.5, 0, 1.2);
        riser(audio, start + 6.9, 1.1, 0.03, 150, 900);
        padChord(audio, start + 7.9, [261.6, 392, 523.3, 784], 2.4, 0.022, 'sine', 3000);
        sparkle(audio, start + 8, 10, 1.8, 0.018);
    },
    draw(ctx, scene, time) {
        const width = scene.width;
        const height = scene.height;
        const cs = Math.min(width / 19.2, height / 11);
        const ox = (width - 18 * cs) / 2;
        const oy = (height - 10 * cs) / 2;
        const state = scene.state;
        if (!state.k) {
            state.k = ELEMENTS.map((e, i) => ({
                s: e[0], x: ox + (tableLayout[e[0]][1] - 1) * cs, y: oy + (tableLayout[e[0]][0] - 1) * cs, t: 300 + Math.pow(i / 117, 1.6) * 5600
            }));
        }
        ctx.fillStyle = '#07040f';
        ctx.fillRect(0, 0, width, height);
        const zoom = easeOutCubic((time - 6900) / 1800);
        const n = state.k.filter(k => time >= k.t).length;
        const og = state.k[117];
        const fade = 1 - smoothstep(6900, 8000, time);
        drawGlow(ctx, width / 2, height / 2, Math.max(width, height) * 0.7, '#3a1d86', 0.35 * smoothstep(0, 3000, time) * fade);
        state.k.forEach((k, i) => {
            const a = (time - k.t) / 1000;
            if (i === 117 && time > 6900) {
                return;
            }
            ctx.globalAlpha = fade;
            if (a >= 0) {
                const fl = Math.max(0, 1 - a * 3);
                ctx.fillStyle = 'rgba(' + (150 + 105 * fl | 0) + ',' + (110 + 120 * fl | 0) + ',255,' + (0.28 + 0.5 * fl + 0.12 * Math.sin(time / 220 + i)) + ')';
                ctx.fillRect(k.x + 0.04 * cs, k.y + 0.04 * cs, 0.92 * cs, 0.92 * cs);
                drawText(ctx, k.s, k.x + cs / 2, k.y + cs / 2, cs * 0.38, '#fff', 0.85, 600);
            } else {
                ctx.strokeStyle = 'rgba(190,170,255,.12)';
                ctx.strokeRect(k.x + 0.5, k.y + 0.5, cs - 1, cs - 1);
            }
            ctx.globalAlpha = 1;
        });
        drawText(ctx, String(n), ox + 7.5 * cs, oy + 1.45 * cs, cs * 2.1, '#d8c8ff', fade, 800);
        drawText(ctx, 'ELEMENTS', ox + 7.5 * cs, oy + 2.65 * cs, cs * 0.3, '#a58cff', fade * 0.8, 600, cs * 0.1);
        const ga = smoothstep(6000, 6150, time) * (1 - smoothstep(6600, 6900, time));
        if (ga > 0) {
            const jx = (Math.sin(time * 0.9) * 0.5) * cs * (time > 6400 ? 0.25 : 0.05);
            ctx.globalAlpha = ga * fade;
            ctx.strokeStyle = '#ff6b9a';
            ctx.setLineDash([cs * 0.12, cs * 0.1]);
            ctx.lineWidth = 2;
            ctx.strokeRect(ox + jx, oy + 7 * cs, cs, cs);
            ctx.setLineDash([]);
            ctx.globalAlpha = 1;
            drawText(ctx, '119?', ox + cs / 2 + jx, oy + 7.5 * cs, cs * 0.36, '#ff6b9a', ga * fade, 700);
        }
        if (time > 6900) {
            const X = og.x + cs / 2;
            const Y = og.y + cs / 2;
            const R = Math.max(width, height);
            const r = cs * 0.5 + easeOutCubic((time - 6900) / 1500) * R * 1.1;
            drawGlow(ctx, X + (width / 2 - X) * zoom, Y + (height / 2 - Y) * zoom, r, '#8a5cff', 0.95);
            drawGlow(ctx, X + (width / 2 - X) * zoom, Y + (height / 2 - Y) * zoom, r * 0.55, '#d8c4ff', 0.8);
            ctx.globalCompositeOperation = 'lighter';
            for (let k = 0; k < 9; k++) {
                ctx.strokeStyle = 'rgba(215,190,255,' + 0.35 * zoom + ')';
                ctx.lineWidth = 1.6;
                ctx.beginPath();
                const a0 = k * 0.7 + time / 2600;
                for (let s = 0; s <= 24; s++) {
                    const q = s / 24;
                    const rr = q * R * 0.6 * zoom;
                    const aa = a0 + Math.sin(q * 9 + time / 160 + k) * 0.18;
                    const px = width / 2 + Math.cos(aa) * rr;
                    const py = height / 2 + Math.sin(aa) * rr;
                    s ? ctx.lineTo(px, py) : ctx.moveTo(px, py);
                }
                ctx.stroke();
            }
            ctx.globalCompositeOperation = 'source-over';
        }
        drawCard(ctx, scene, time, 7800, '#efe6ff', '#8b5cff');
    }
};
// Ts: a heavy-ion accelerator fires calcium-48 at a berkelium target and the nuclei fuse
CUTSCENES.Ts = {
    z: 117, dur: 10000,
    snd(audio, start) {
        riser(audio, start + 0.2, 5.2, 0.03, 70, 950);
        for (let i = 0; i < 26; i++) {
            playNoise(audio, start + 2.6 + i * 0.12, 0.07, 0.03, 2400 + i * 160, 600, 'bandpass', 3, 0.2);
        }
        boom(audio, start + 5.5, 0.26, 2.4);
        playNoise(audio, start + 5.5, 1.6, 0.14, 7000, 200, 'lowpass', 0.7, 0.4);
        padChord(audio, start + 6.5, [220, 329.6, 440, 659.3], 3.2, 0.02, 'sawtooth', 1800);
        arp(audio, start + 7.1, [880, 1318, 1760, 2637], 0.17, 0.03);
    },
    draw(ctx, scene, time) {
        const width = scene.width;
        const height = scene.height;
        const unit = scene.unit;
        const state = scene.state;
        const y0 = height * 0.5;
        const xa = width * 0.2;
        const xt = width * 0.78;
        if (!state.i) {
            const r = seededRandom(117);
            state.i = Array.from({ length: 26 }, (_, i) => ({ l: 2600 + i * 55, j: (r() - 0.5) * 5 * unit, o: r() * 6.28 }));
            state.q = [];
            for (let a = 0; a < 5; a++) {
                for (let b = 0; b < 13; b++) {
                    state.q.push([xt + (a - 2) * 1.8 * unit, y0 + (b - 6) * 2.6 * unit + (a % 2) * 1.2 * unit]);
                }
            }
        }
        ctx.fillStyle = '#0a0705';
        ctx.fillRect(0, 0, width, height);
        const burst = smoothstep(5450, 5600, time) * (1 - smoothstep(5600, 7000, time));
        const post = time > 5500;
        drawGlow(ctx, width / 2, height * 1.1, width * 0.7, '#5a2a08', 0.55);
        ctx.fillStyle = '#2a1c12';
        ctx.fillRect(width * 0.06, y0 - 1.2 * unit, xt - width * 0.06, 2.4 * unit);
        const lit = smoothstep(2400, 3000, time) * (1 - smoothstep(5500, 5900, time));
        ctx.fillStyle = 'rgba(120,220,255,' + (0.15 + 0.5 * lit) + ')';
        ctx.fillRect(width * 0.06, y0 - 0.25 * unit, xt - width * 0.06, 0.5 * unit);
        for (let k = 0; k < 8; k++) {
            const x = width * 0.3 + k * width * 0.06;
            const p = 0.3 + 0.7 * Math.max(0, Math.sin(time / 180 - k * 0.9)) * lit;
            ctx.strokeStyle = 'rgba(255,170,70,' + (0.35 + 0.45 * p) + ')';
            ctx.lineWidth = 0.5 * unit;
            ctx.strokeRect(x - 1.3 * unit, y0 - 4 * unit, 2.6 * unit, 8 * unit);
        }
        ctx.strokeStyle = 'rgba(255,180,80,.35)';
        ctx.lineWidth = 0.4 * unit;
        ctx.beginPath();
        ctx.arc(xa - 6 * unit, y0, 13 * unit, 0, TAU);
        ctx.stroke();
        if (time < 2900) {
            state.i.forEach((s, i) => {
                const p = time / 2600;
                const a = s.o + p * p * 60 + i;
                const r = (3 + 10 * Math.min(1, p * 1.1)) * unit;
                drawGlow(ctx, xa - 6 * unit + Math.cos(a) * r, y0 + Math.sin(a) * r, 2.4 * unit, '#9be8ff', 0.9 * smoothstep(0, 500, time));
            });
        }
        state.i.forEach(s => {
            const p = clamp((time - s.l) / 2100);
            if (p <= 0 || p >= 1) {
                return;
            }
            const x = xa + (xt - xa) * Math.pow(p, 2.4);
            const y = y0 + s.j * (1 - p);
            ctx.strokeStyle = 'rgba(160,235,255,.7)';
            ctx.lineWidth = 0.45 * unit;
            ctx.beginPath();
            ctx.moveTo(x - (4 + 20 * p) * unit, y);
            ctx.lineTo(x, y);
            ctx.stroke();
            drawGlow(ctx, x, y, 2.4 * unit, '#d6f7ff', 1);
            if (p > 0.97) {
                drawGlow(ctx, xt, y, 6 * unit, '#ffd9a0', 0.7);
            }
        });
        state.q.forEach(([x, y], i) => {
            const sc = post ? easeOutCubic((time - 5500) / 1400) * (18 + i % 7 * 3) * unit : 0;
            const a = i * 2.4;
            ctx.fillStyle = 'rgba(255,150,50,' + (post ? 1 - smoothstep(5500, 6800, time) : 0.95) + ')';
            ctx.beginPath();
            ctx.arc(x + Math.cos(a) * sc, y + Math.sin(a) * sc, 0.85 * unit, 0, TAU);
            ctx.fill();
        });
        drawGlow(ctx, xt, y0, Math.max(width, height) * 0.9, '#fff2d8', burst);
        for (let k = 0; k < 3; k++) {
            const p = (time - 5500 - k * 180) / 1500;
            if (p > 0 && p < 1) {
                ctx.strokeStyle = 'rgba(255,200,120,' + (1 - p) + ')';
                ctx.lineWidth = unit;
                ctx.beginPath();
                ctx.arc(xt, y0, easeOutCubic(p) * 45 * unit, 0, TAU);
                ctx.stroke();
            }
        }
        if (time > 5700 && time < 7900) {
            const p = smoothstep(5700, 6600, time);
            const f = 1 - smoothstep(7300, 7900, time);
            const mv = xt + (width / 2 - xt) * smoothstep(6200, 7500, time);
            drawGlow(ctx, mv, y0, (8 + 14 * p) * unit, '#ffb04a', 0.95 * f);
            ctx.fillStyle = 'rgba(255,246,220,' + f + ')';
            ctx.beginPath();
            ctx.arc(mv + Math.sin(time / 60) * 0.5 * unit, y0, (1.5 + 2.5 * p) * unit, 0, TAU);
            ctx.fill();
        }
        drawText(ctx, '48Ca  +  249Bk', width * 0.5, height * 0.16, 3.2 * unit, '#ffc27a', smoothstep(500, 1200, time) * (1 - smoothstep(5400, 5700, time)), 600, 0.8 * unit);
        drawCard(ctx, scene, time, 7900, '#ffd9a0', '#ff8a1f');
    }
};
// Lv: the chart of nuclides drains away and the island of stability rises
CUTSCENES.Lv = {
    z: 116, dur: 10000,
    snd(audio, start) {
        padChord(audio, start, [98, 146.8, 196], 6.5, 0.016, 'sine', 900);
        for (let i = 0; i < 4; i++) {
            playTone(audio, 880, start + 1.2 + i * 1.3, 1.4, 0.012, 'sine', null, 0.8, 0, 0.01);
        }
        riser(audio, start + 3.6, 2.8, 0.025, 90, 700);
        playTone(audio, 196, start + 6.4, 2.6, 0.035, 'sine', null, 0.5, 0, 0.4);
        arp(audio, start + 6.5, [392, 587.3, 784, 1174.7, 1568], 0.16, 0.03, 'sine');
        padChord(audio, start + 7.2, [196, 293.7, 392, 587.3], 3, 0.02, 'sine', 2400);
        sparkle(audio, start + 7.6, 12, 2.2, 0.016);
    },
    draw(ctx, scene, time) {
        const width = scene.width;
        const height = scene.height;
        const unit = scene.unit;
        const x0 = width * 0.06;
        const y0 = height * 0.12;
        const gw = width * 0.88;
        const gh = height * 0.76;
        const cols = 60;
        const rows = 32;
        const cw = gw / cols;
        const ch = gh / rows;
        ctx.fillStyle = '#031018';
        ctx.fillRect(0, 0, width, height);
        const L = 1 - 0.86 * easeOutCubic((time - 1500) / 5200);
        const sw = smoothstep(0, 1200, time);
        for (let j = 0; j < rows; j++) {
            for (let i = 0; i < cols; i++) {
                const nx = i / cols;
                const ny = 1 - j / rows;
                const h = Math.exp(-(Math.pow((nx - 0.66) / 0.17, 2) + Math.pow((ny - 0.4) / 0.2, 2))) * (0.85 + 0.15 * Math.sin(nx * 40 + ny * 25)) + 0.05 * Math.sin(nx * 9 + ny * 7);
                const d = h - L;
                let r;
                let gg;
                let b;
                if (d > 0) {
                    const k = clamp(d * 1.8);
                    r = 190 + 60 * k;
                    gg = 150 + 70 * k;
                    b = 60 + 60 * k;
                } else {
                    const k = clamp(-d * 1.1);
                    const w2 = 0.5 + 0.5 * Math.sin(time / 420 + i * 0.5 + j * 0.3);
                    r = 8 + 10 * w2 * (1 - k);
                    gg = 50 + 70 * (1 - k) + 25 * w2;
                    b = 90 + 90 * (1 - k);
                }
                if (Math.abs(d) < 0.035) {
                    r = 210;
                    gg = 250;
                    b = 255;
                }
                ctx.fillStyle = 'rgb(' + (r | 0) + ',' + (gg | 0) + ',' + (b | 0) + ')';
                ctx.globalAlpha = sw * (0.35 + 0.5 * clamp(1 - Math.abs(d) * 1.2));
                ctx.fillRect(x0 + i * cw + cw * 0.1, y0 + j * ch + ch * 0.1, cw * 0.8, ch * 0.8);
            }
        }
        ctx.globalAlpha = 1;
        drawText(ctx, 'NEUTRON NUMBER  N', width / 2, y0 + gh + 3.4 * unit, 1.8 * unit, '#7fd7ff', sw * 0.8, 600, 0.5 * unit);
        ctx.save();
        ctx.translate(x0 - 2.6 * unit, height / 2);
        ctx.rotate(-1.5708);
        drawText(ctx, 'PROTON NUMBER  Z', 0, 0, 1.8 * unit, '#7fd7ff', sw * 0.8, 600, 0.5 * unit);
        ctx.restore();
        const mx = x0 + gw * 0.66;
        const my = y0 + gh * 0.6;
        for (let k = 0; k < 3; k++) {
            const p = (time - 5400 - k * 500) / 2200;
            if (p > 0 && p < 1) {
                ctx.strokeStyle = 'rgba(255,215,120,' + (1 - p) * 0.8 + ')';
                ctx.lineWidth = 0.5 * unit;
                ctx.beginPath();
                ctx.arc(mx, my, easeOutCubic(p) * 40 * unit, 0, TAU);
                ctx.stroke();
            }
        }
        const bp = smoothstep(5300, 5800, time);
        drawGlow(ctx, mx, my, 12 * unit, '#ffd36b', bp * 0.9 * (1 - smoothstep(7600, 8300, time)));
        ctx.strokeStyle = 'rgba(255,232,170,' + bp + ')';
        ctx.lineWidth = 0.35 * unit;
        ctx.beginPath();
        ctx.moveTo(mx - 5 * unit, my);
        ctx.lineTo(mx + 5 * unit, my);
        ctx.moveTo(mx, my - 5 * unit);
        ctx.lineTo(mx, my + 5 * unit);
        ctx.stroke();
        drawText(ctx, 'ISLAND OF STABILITY', mx, my - 9 * unit, 2.2 * unit, '#ffe6a0', bp * (1 - smoothstep(7400, 8000, time)), 700, 0.5 * unit);
        drawGlow(ctx, width / 2, height / 2, Math.max(width, height) * 0.55, '#021018', smoothstep(7300, 8000, time) * 0.85);
        drawCard(ctx, scene, time, 7900, '#ffe08a', '#ffb13b');
    }
};
// Mc: five alpha decays step down the chain from 288Mc to 268Db on a snowy Moscow night
CUTSCENES.Mc = {
    z: 115, dur: 10000,
    snd(audio, start) {
        const bell = (x, f, v) => [1, 2.76, 5.4, 8.1].forEach((r, i) => playTone(audio, f * r, start + x, 3.2 / (1 + i), v / (1 + i * 1.4), 'sine', null, 0.7, 0, 0.004));
        padChord(audio, start, [73.4, 110, 146.8], 8, 0.012, 'sine', 700);
        bell(0.9, 174.6, 0.08);
        for (let i = 0; i < 5; i++) {
            const x = 1.6 + i * 1.1;
            boom(audio, start + x, 0.05, 0.7);
            playTone(audio, 1500, start + x, 0.5, 0.018, 'sine', 420, 0.4);
            bell(x + 0.05, 196 + i * 22, 0.06);
        }
        riser(audio, start + 6.4, 1.2, 0.03, 100, 1000);
        boom(audio, start + 7.5, 0.22, 2.2);
        padChord(audio, start + 7.7, [146.8, 220, 293.7, 440], 3, 0.022, 'sine', 2400);
        sparkle(audio, start + 7.9, 10, 2, 0.017);
    },
    draw(ctx, scene, time) {
        const width = scene.width;
        const height = scene.height;
        const unit = scene.unit;
        const state = scene.state;
        const Z = [['Mc', 115, 288], ['Nh', 113, 284], ['Rg', 111, 280], ['Mt', 109, 276], ['Bh', 107, 272], ['Db', 105, 268]];
        const st = Math.min(width * 0.14, 17 * unit);
        const bx = i => width * 0.5 + (i - 2.5) * st;
        const by = i => height * 0.17 + i * Math.min(height * 0.115, 13 * unit);
        const bs = Math.min(width * 0.12, 12 * unit);
        const ev = i => 1500 + i * 1100;
        if (!state.f) {
            const r = seededRandom(115);
            state.f = Array.from({ length: 130 }, () => [r() * width, r() * height, r() * 1.6 + 0.6, r() * 6.28, r() * 0.5 + 0.5]);
        }
        const fa = 1 - smoothstep(7300, 8100, time);
        const gr = ctx.createLinearGradient(0, 0, 0, height);
        gr.addColorStop(0, '#10060e');
        gr.addColorStop(0.6, '#2a0a18');
        gr.addColorStop(1, '#5a1424');
        ctx.fillStyle = gr;
        ctx.fillRect(0, 0, width, height);
        ctx.fillStyle = '#14040b';
        [[0.18, 0.07, 0.1], [0.3, 0.05, 0.07], [0.5, 0.09, 0.14], [0.7, 0.05, 0.08], [0.82, 0.07, 0.12]].forEach(([x, w, h]) => {
            const X = width * x;
            const bw = width * w;
            const bh = height * h;
            ctx.fillRect(X - bw / 2, height - bh, bw, bh);
            ctx.beginPath();
            ctx.moveTo(X - bw * 0.6, height - bh);
            ctx.quadraticCurveTo(X - bw * 0.7, height - bh - bw * 0.9, X, height - bh - bw * 1.5);
            ctx.quadraticCurveTo(X + bw * 0.7, height - bh - bw * 0.9, X + bw * 0.6, height - bh);
            ctx.fill();
            ctx.fillRect(X - 0.15 * unit, height - bh - bw * 1.5 - 3 * unit, 0.3 * unit, 3 * unit);
        });
        state.f.forEach(([x, y, r, ph, sp]) => {
            const yy = (y + time * sp * 0.06) % height;
            const xx = x + Math.sin(time / 900 * sp + ph) * 2.5 * unit;
            ctx.fillStyle = 'rgba(235,245,255,' + (0.35 + 0.4 * sp) + ')';
            ctx.beginPath();
            ctx.arc(xx, yy, r * unit * 0.28, 0, TAU);
            ctx.fill();
        });
        drawText(ctx, 'ALPHA DECAY CHAIN', width / 2, height * 0.07, 2.2 * unit, '#ffb0b8', smoothstep(300, 1000, time) * fa, 600, 0.7 * unit);
        for (let i = 0; i < 6; i++) {
            const X = bx(i);
            const Y = by(i);
            const on = i === 0 ? smoothstep(0, 900, time) : smoothstep(ev(i - 1), ev(i - 1) + 300, time);
            const off = i < 5 ? smoothstep(ev(i), ev(i) + 700, time) : smoothstep(7000, 7300, time);
            const a = on * (1 - 0.6 * off) * fa;
            if (i > 0) {
                const p = smoothstep(ev(i - 1) - 100, ev(i - 1) + 350, time);
                ctx.strokeStyle = 'rgba(255,120,130,' + 0.7 * p * fa + ')';
                ctx.lineWidth = 0.5 * unit;
                ctx.beginPath();
                ctx.moveTo(bx(i - 1), by(i - 1));
                ctx.lineTo(bx(i - 1) + (X - bx(i - 1)) * p, by(i - 1) + (Y - by(i - 1)) * p);
                ctx.stroke();
            }
            drawGlow(ctx, X, Y, bs * 1.6, '#ff4d5e', a * (0.5 * (1 - off) + 0.15));
            ctx.fillStyle = 'rgba(40,8,18,' + 0.8 * a + ')';
            ctx.strokeStyle = 'rgba(255,140,150,' + a + ')';
            ctx.lineWidth = 0.4 * unit;
            ctx.fillRect(X - bs / 2, Y - bs / 2, bs, bs);
            ctx.strokeRect(X - bs / 2, Y - bs / 2, bs, bs);
            drawText(ctx, Z[i][0], X, Y + 0.5 * unit, bs * 0.42, '#fff', a, 700);
            drawText(ctx, String(Z[i][2]), X - bs * 0.3, Y - bs * 0.34, bs * 0.18, '#ffb0b8', a, 600);
            drawText(ctx, String(Z[i][1]), X - bs * 0.3, Y + bs * 0.36, bs * 0.18, '#ffb0b8', a, 600);
            if (i < 5) {
                const p = (time - ev(i)) / 1000;
                if (p > 0 && p < 1) {
                    const x = X + p * 34 * unit;
                    const y = Y - p * 24 * unit;
                    const al = 1 - p;
                    drawGlow(ctx, X, Y, 12 * unit, '#ffb0b8', (1 - clamp(p * 3)));
                    [[-1, -1, '#ff5a6a'], [1, -1, '#7aa8ff'], [-1, 1, '#7aa8ff'], [1, 1, '#ff5a6a']].forEach(([a, b, c]) => {
                        ctx.fillStyle = c;
                        ctx.globalAlpha = al;
                        ctx.beginPath();
                        ctx.arc(x + a * 0.8 * unit, y + b * 0.8 * unit, unit, 0, TAU);
                        ctx.fill();
                        ctx.globalAlpha = 1;
                    });
                    drawGlow(ctx, x, y, 5 * unit, '#ffd0d6', al * 0.6);
                }
            }
        }
        const rb = smoothstep(7300, 8000, time);
        drawGlow(ctx, width / 2, height / 2, Math.max(width, height) * 0.7, '#ff3d55', rb * 0.45 * (1 - smoothstep(8000, 9500, time) * 0.4));
        drawCard(ctx, scene, time, 7900, '#fff0f2', '#ff4d5e');
    }
};
// Fl: protons fill the nuclear shells one by one until 114 closes a shell
CUTSCENES.Fl = {
    z: 114, dur: 10000,
    snd(audio, start) {
        padChord(audio, start, [82.4, 123.5, 164.8], 7.4, 0.014, 'sine', 800);
        for (let i = 0; i < 38; i++) {
            const x = 0.5 + 5.6 * Math.pow(i / 37, 1.25);
            playTone(audio, 520 + i * 16, start + x, 0.07, 0.012, 'triangle', null, 0.3, 0, 0.002);
        }
        playNoise(audio, start + 6.15, 0.12, 0.05, 6000, 1500, 'highpass', 1, 0.3, 0.002);
        boom(audio, start + 6.2, 0.18, 2);
        playTone(audio, 329.6, start + 6.2, 3, 0.03, 'sine', null, 0.6, 0, 0.02);
        arp(audio, start + 6.4, [329.6, 415.3, 493.9, 659.3, 830.6, 987.8], 0.12, 0.028, 'sine');
        padChord(audio, start + 7.6, [164.8, 246.9, 329.6, 493.9], 3, 0.02, 'sine', 2600);
        sparkle(audio, start + 7.8, 10, 2, 0.016);
    },
    draw(ctx, scene, time) {
        const W = scene.width;
        const H = scene.height;
        const u = scene.unit;
        const st = scene.state;
        const cx = W / 2;
        const cy = H * 0.5;
        const shells = [2, 6, 12, 8, 22, 32, 32];
        const R = Math.min(W, H * 0.78) * 0.4;
        const rr = s => R * (0.16 + 0.84 * (s + 1) / shells.length);
        if (!st.p) {
            const r = seededRandom(114);
            st.p = [];
            let n = 0;
            shells.forEach((c, s) => {
                for (let k = 0; k < c; k++) {
                    st.p.push({ s, a: k / c * TAU + s * 0.7 + r() * 0.12, t: 500 + 5600 * Math.pow(n / 113, 1.25) });
                    n++;
                }
            });
            st.full = shells.map((c, s) => Math.max(...st.p.filter(p => p.s === s).map(p => p.t)));
        }
        const fa = 1 - smoothstep(7300, 8100, time);
        const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.max(W, H) * 0.75);
        g.addColorStop(0, '#0b2a26');
        g.addColorStop(1, '#03100e');
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, W, H);
        const close = smoothstep(6150, 6350, time);
        drawGlow(ctx, cx, cy, rr(0) * 2.2, '#2fe0b0', 0.25 + 0.6 * close * fa);
        shells.forEach((c, s) => {
            const full = time >= st.full[s];
            const fl = full ? 1 - smoothstep(st.full[s], st.full[s] + 700, time) : 0;
            ctx.strokeStyle = 'rgba(47,224,176,' + ((full ? 0.55 : 0.18) + 0.4 * fl + 0.4 * close) * fa + ')';
            ctx.lineWidth = (full ? 0.35 : 0.2) * u + fl * 0.6 * u;
            ctx.beginPath();
            ctx.arc(cx, cy, rr(s), 0, TAU);
            ctx.stroke();
        });
        let count = 0;
        st.p.forEach(p => {
            if (time < p.t) {
                return;
            }
            count++;
            const age = time - p.t;
            const spin = (0.00012 + 0.00005 * (shells.length - p.s)) * time * (p.s % 2 ? -1 : 1);
            const x = cx + Math.cos(p.a + spin) * rr(p.s);
            const y = cy + Math.sin(p.a + spin) * rr(p.s);
            const pop = 1 - smoothstep(0, 400, age);
            drawGlow(ctx, x, y, (1.6 + 3 * pop) * u, '#7dffd6', (0.35 + 0.6 * pop) * fa);
            ctx.fillStyle = 'rgba(232,255,248,' + fa + ')';
            ctx.beginPath();
            ctx.arc(x, y, 0.55 * u * (1 + pop), 0, TAU);
            ctx.fill();
        });
        const ring = clamp((time - 6200) / 1300);
        if (ring > 0 && ring < 1) {
            ctx.strokeStyle = 'rgba(160,255,225,' + (1 - ring) + ')';
            ctx.lineWidth = (1 - ring) * 1.5 * u;
            ctx.beginPath();
            ctx.arc(cx, cy, rr(shells.length - 1) * (1 + ring * 0.6), 0, TAU);
            ctx.stroke();
        }
        drawText(ctx, 'PROTONS', W / 2, H * 0.06, 2.1 * u, '#7dffd6', smoothstep(300, 900, time) * fa * (1 - close), 600, 0.7 * u);
        drawText(ctx, 'Z = ' + count, W / 2, H * 0.1, 3.6 * u, '#e8fff8', smoothstep(300, 900, time) * fa, 700);
        drawText(ctx, 'SHELL CLOSED', W / 2, H * 0.06, 2.1 * u, '#7dffd6', close * fa, 600, 0.7 * u);
        drawText(ctx, 'A PREDICTED MAGIC NUMBER', W / 2, H * 0.94, 2 * u, '#7dffd6', smoothstep(6400, 6900, time) * fa, 600, 0.5 * u);
        const rb = smoothstep(7300, 8000, time);
        drawGlow(ctx, W / 2, H / 2, Math.max(W, H) * 0.7, '#2fe0b0', rb * 0.4 * (1 - smoothstep(8000, 9500, time) * 0.4));
        drawCard(ctx, scene, time, 7900, '#e8fff8', '#2fe0b0');
    }
};
// Nh: nine years at RIKEN catch three atoms, then the sun rises over Japan
CUTSCENES.Nh = {
    z: 113, dur: 10000,
    snd(audio, start) {
        padChord(audio, start, [73.4, 110, 146.8], 6.6, 0.013, 'sine', 600);
        for (let i = 0; i < 10; i++) {
            playTone(audio, 1046.5, start + 0.6 + i * 0.6, 0.12, 0.008, 'sine', null, 0.4, 0, 0.003);
        }
        [1.58, 2.05, 5.98].forEach((x, i) => {
            playTone(audio, [880, 987.8, 1174.7][i], start + x, 2.2, 0.03, 'sine', null, 0.8, 0, 0.004);
            playTone(audio, [1760, 1975.5, 2349.3][i], start + x, 1.6, 0.012, 'sine', null, 0.8, 0, 0.004);
        });
        riser(audio, start + 6.2, 1.4, 0.02, 80, 700);
        padChord(audio, start + 6.9, [146.8, 220, 293.7, 440], 3.4, 0.022, 'sine', 2200);
        arp(audio, start + 7.2, [293.7, 329.6, 440, 587.3, 659.3, 880], 0.16, 0.026, 'triangle');
        sparkle(audio, start + 7.8, 8, 2, 0.015);
    },
    draw(ctx, scene, time) {
        const W = scene.width;
        const H = scene.height;
        const u = scene.unit;
        const st = scene.state;
        const hz = H * 0.66;
        if (!st.s) {
            const r = seededRandom(113);
            st.s = Array.from({ length: 110 }, () => [r() * W, r() * hz * 0.95, r() * 0.8 + 0.3, r() * 6.28]);
            st.w = Array.from({ length: 34 }, () => [r(), r() * (H - hz), r() * 0.6 + 0.2]);
        }
        const fa = 1 - smoothstep(7300, 8100, time);
        const dawn = smoothstep(5800, 7600, time);
        const mixc = (a, b, k) => 'rgb(' + a.map((v, i) => Math.round(v + (b[i] - v) * k)).join(',') + ')';
        const g = ctx.createLinearGradient(0, 0, 0, hz);
        g.addColorStop(0, mixc([4, 6, 18], [40, 18, 40], dawn));
        g.addColorStop(1, mixc([10, 16, 38], [232, 110, 80], dawn));
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, W, hz);
        st.s.forEach(([x, y, r, ph]) => {
            const a = (0.45 + 0.35 * Math.sin(time / 500 + ph)) * (1 - dawn * 0.9);
            ctx.fillStyle = 'rgba(255,255,255,' + a + ')';
            ctx.beginPath();
            ctx.arc(x, y, r * u * 0.25, 0, TAU);
            ctx.fill();
        });
        // the sun rises
        const rise = smoothstep(6000, 7800, time);
        const sr = Math.min(W, H) * 0.17;
        const sy = hz + sr * 1.05 - rise * sr * 1.9;
        drawGlow(ctx, W / 2, sy, sr * 3.4, '#ff6a4a', 0.55 * rise);
        ctx.save();
        ctx.beginPath();
        ctx.rect(0, 0, W, hz);
        ctx.clip();
        ctx.globalAlpha = 1 - 0.85 * smoothstep(7500, 8300, time);
        ctx.fillStyle = '#e8263a';
        ctx.beginPath();
        ctx.arc(W / 2, sy, sr, 0, TAU);
        ctx.fill();
        ctx.restore();
        // sea
        const sg = ctx.createLinearGradient(0, hz, 0, H);
        sg.addColorStop(0, mixc([8, 14, 30], [90, 40, 50], dawn));
        sg.addColorStop(1, mixc([2, 4, 10], [20, 10, 18], dawn));
        ctx.fillStyle = sg;
        ctx.fillRect(0, hz, W, H - hz);
        st.w.forEach(([x, y, l]) => {
            const yy = hz + y;
            const xx = ((x + time * 0.00002 * (1 + y / H)) % 1) * W;
            const near = Math.abs(xx - W / 2) < sr * (1.2 + y / (H - hz));
            ctx.fillStyle = near && rise > 0.05 ? 'rgba(255,120,90,' + 0.6 * rise + ')' : 'rgba(180,200,255,' + 0.12 * (1 - dawn * 0.5) + ')';
            ctx.fillRect(xx - l * 6 * u, yy, l * 12 * u, 0.25 * u);
        });
        // nine years, three atoms
        const yr = 2003.7 + 8.9 * clamp((time - 600) / 5600);
        const atoms = [[2004.55, 0.28, 0.24], [2005.3, 0.7, 0.18], [2012.6, 0.48, 0.32]];
        atoms.forEach(([at, ax, ay], i) => {
            const tAt = 600 + (at - 2003.7) / 8.9 * 5600;
            if (time < tAt) {
                return;
            }
            const age = time - tAt;
            const x = W * ax;
            const y = hz * ay;
            const fl = 1 - smoothstep(0, 900, age);
            drawGlow(ctx, x, y, (3 + 14 * fl) * u, '#ffd0c0', (0.5 + 0.5 * fl) * fa);
            ctx.strokeStyle = 'rgba(255,220,210,' + fl * fa + ')';
            ctx.lineWidth = 0.3 * u;
            ctx.beginPath();
            ctx.arc(x, y, (2 + 18 * (1 - fl)) * u, 0, TAU);
            ctx.stroke();
            ctx.fillStyle = 'rgba(255,245,240,' + fa + ')';
            ctx.beginPath();
            ctx.arc(x, y, 0.8 * u, 0, TAU);
            ctx.fill();
            drawText(ctx, String(i + 1), x + 3 * u, y - 3 * u, 2 * u, '#ffd0c0', smoothstep(0, 400, age) * fa * (1 - dawn), 700);
        });
        const ya = smoothstep(300, 900, time) * fa * (1 - smoothstep(6100, 6600, time));
        drawText(ctx, String(Math.min(2012, Math.floor(yr))), W / 2, H * 0.84, 5 * u, '#e8eeff', ya, 700, 0.4 * u);
        drawText(ctx, 'RIKEN · WAKO', W / 2, H * 0.9, 1.9 * u, '#9fb4ff', ya, 600, 0.6 * u);
        drawText(ctx, 'THREE ATOMS IN NINE YEARS', W / 2, H * 0.07, 2.1 * u, '#ffd0c0', smoothstep(6100, 6700, time) * fa, 600, 0.6 * u);
        const rb = smoothstep(7300, 8000, time);
        drawGlow(ctx, W / 2, H / 2, Math.max(W, H) * 0.7, '#e8263a', rb * 0.4 * (1 - smoothstep(8000, 9500, time) * 0.4));
        drawCard(ctx, scene, time, 7900, '#fff2ee', '#e8263a');
    }
};
// Cn: a brass orrery turns from Earth at the centre to the Sun at the centre
CUTSCENES.Cn = {
    z: 112, dur: 10000,
    snd(audio, start) {
        for (let i = 0; i < 28; i++) {
            playNoise(audio, start + 0.2 + i * 0.22, 0.025, 0.035, 5200, 2600, 'bandpass', 6, 0.15, 0.001);
        }
        padChord(audio, start, [98, 146.8, 196], 3.6, 0.013, 'triangle', 900);
        arp(audio, start + 0.8, [392, 466.2, 587.3, 698.5, 587.3, 466.2], 0.3, 0.018, 'triangle');
        riser(audio, start + 3.4, 2, 0.02, 120, 800);
        padChord(audio, start + 3.6, [116.5, 174.6, 233.1], 2.4, 0.014, 'triangle', 1200);
        boom(audio, start + 5.5, 0.12, 1.6);
        arp(audio, start + 5.6, [392, 493.9, 587.3, 784, 987.8, 1174.7], 0.14, 0.024, 'triangle');
        padChord(audio, start + 7.4, [196, 293.7, 392, 587.3], 3, 0.02, 'sine', 2400);
        sparkle(audio, start + 7.8, 10, 2, 0.016);
    },
    draw(ctx, scene, time) {
        const W = scene.width;
        const H = scene.height;
        const u = scene.unit;
        const st = scene.state;
        const cx = W / 2;
        const cy = H / 2;
        const R = Math.min(W, H) * 0.29;
        // Mercury, Venus, Earth, Mars, Jupiter, Saturn: [orbit share, colour, size, phase]
        const P = [[0.2, '#c9b9a0', 0.7, 0.4], [0.36, '#f3d9a4', 0.95, 2.1], [0.52, '#6fb4ff', 1, 4.0], [0.67, '#ff8a5c', 0.8, 1.2], [0.85, '#e8c38a', 1.6, 5.2], [1, '#e9d7a6', 1.4, 3.3]];
        if (!st.s) {
            const r = seededRandom(112);
            st.s = Array.from({ length: 140 }, () => [r() * W, r() * H, r() * 0.7 + 0.2]);
        }
        const fa = 1 - smoothstep(7300, 8100, time);
        const helio = smoothstep(3400, 5600, time);
        ctx.fillStyle = '#07070d';
        ctx.fillRect(0, 0, W, H);
        st.s.forEach(([x, y, r]) => {
            ctx.fillStyle = 'rgba(255,240,210,' + 0.5 * r + ')';
            ctx.fillRect(x, y, r * 0.3 * u, r * 0.3 * u);
        });
        const pos = (i, t) => {
            const a = P[i][3] + t * 0.0011 / Math.pow(P[i][0], 1.5);
            return [Math.cos(a) * R * P[i][0], Math.sin(a) * R * P[i][0] * 0.92];
        };
        // geocentric view = position relative to Earth; heliocentric = position relative to the Sun
        const view = (i, t) => {
            const p = pos(i, t);
            const e = pos(2, t);
            return [cx + p[0] - e[0] * (1 - helio), cy + p[1] - e[1] * (1 - helio)];
        };
        const sun = t => {
            const e = pos(2, t);
            return [cx - e[0] * (1 - helio), cy - e[1] * (1 - helio)];
        };
        // brass rings: centred on the Sun once it takes the middle
        const ringA = (0.25 + 0.6 * helio + 0.4 * smoothstep(5600, 6200, time) * (1 - smoothstep(6600, 7400, time))) * fa;
        P.forEach(p => {
            ctx.strokeStyle = 'rgba(232,176,74,' + ringA * 0.7 + ')';
            ctx.lineWidth = 0.3 * u;
            ctx.beginPath();
            ctx.ellipse(sun(time)[0], sun(time)[1], R * p[0], R * p[0] * 0.92, 0, 0, TAU);
            ctx.stroke();
        });
        // loops traced by the planets (epicycles in the Earth-centred view)
        P.forEach((p, i) => {
            if (i === 2 && helio < 0.5) {
                return;
            }
            ctx.strokeStyle = p[1];
            ctx.globalAlpha = 0.35 * fa;
            ctx.lineWidth = 0.25 * u;
            ctx.beginPath();
            for (let k = 0; k <= 60; k++) {
                const [x, y] = view(i, time - k * 70);
                if (k) {
                    ctx.lineTo(x, y);
                } else {
                    ctx.moveTo(x, y);
                }
            }
            ctx.stroke();
            ctx.globalAlpha = 1;
        });
        const [sx, sy] = sun(time);
        drawGlow(ctx, sx, sy, 9 * u * (1 + helio * 0.6), '#ffb84a', 0.9 * fa);
        ctx.fillStyle = 'rgba(255,214,120,' + fa + ')';
        ctx.beginPath();
        ctx.arc(sx, sy, 2.4 * u, 0, TAU);
        ctx.fill();
        P.forEach((p, i) => {
            const [x, y] = view(i, time);
            if (i === 4 || i === 5) {
                ctx.strokeStyle = 'rgba(232,210,160,' + 0.6 * fa + ')';
                ctx.lineWidth = 0.2 * u;
                ctx.beginPath();
                ctx.ellipse(x, y, p[2] * 1.9 * u, p[2] * 0.6 * u, -0.3, 0, TAU);
                if (i === 5) {
                    ctx.stroke();
                }
            }
            drawGlow(ctx, x, y, p[2] * 2.4 * u, p[1], 0.4 * fa);
            ctx.fillStyle = p[1];
            ctx.globalAlpha = fa;
            ctx.beginPath();
            ctx.arc(x, y, p[2] * u, 0, TAU);
            ctx.fill();
            ctx.globalAlpha = 1;
        });
        drawText(ctx, 'EARTH AT THE CENTRE', W / 2, H * 0.07, 2.1 * u, '#e8b04a', smoothstep(300, 900, time) * (1 - smoothstep(3200, 3800, time)), 600, 0.7 * u);
        drawText(ctx, 'THE SUN AT THE CENTRE', W / 2, H * 0.07, 2.1 * u, '#e8b04a', smoothstep(5200, 5800, time) * fa, 600, 0.7 * u);
        drawText(ctx, 'DE REVOLUTIONIBUS · 1543', W / 2, H * 0.93, 2 * u, '#f3d9a4', smoothstep(5800, 6400, time) * fa, 600, 0.6 * u);
        const rb = smoothstep(7300, 8000, time);
        drawGlow(ctx, W / 2, H / 2, Math.max(W, H) * 0.7, '#e8b04a', rb * 0.4 * (1 - smoothstep(8000, 9500, time) * 0.4));
        drawCard(ctx, scene, time, 7900, '#fff6e0', '#e8b04a');
    }
};
// Rg: a Crookes tube flickers and an X-ray reveals a hand wearing a gold ring
CUTSCENES.Rg = {
    z: 111, dur: 10000,
    snd(audio, start) {
        playTone(audio, 50, start + 0.1, 5.6, 0.02, 'sawtooth', null, 0.1, 0, 0.3);
        playTone(audio, 100, start + 0.1, 5.6, 0.012, 'square', null, 0.1, 0, 0.3);
        for (let i = 0; i < 14; i++) {
            playNoise(audio, start + 0.3 + Math.random() * 2.2, 0.04, 0.05, 9000, 3000, 'highpass', 1, 0.1, 0.002);
        }
        playNoise(audio, start + 2.6, 3, 0.03, 600, 5000, 'bandpass', 3, 0.3, 1.2);
        playTone(audio, 1318.5, start + 6, 2.4, 0.03, 'sine', null, 0.8, 0, 0.003);
        playTone(audio, 2637, start + 6.05, 1.8, 0.014, 'sine', null, 0.8, 0, 0.003);
        boom(audio, start + 6, 0.08, 1.4);
        padChord(audio, start + 7, [164.8, 246.9, 329.6, 493.9], 3.4, 0.02, 'sine', 2400);
        sparkle(audio, start + 7.6, 12, 2, 0.017, [1318.5, 1568, 1975.5, 2637]);
    },
    draw(ctx, scene, time) {
        const W = scene.width;
        const H = scene.height;
        const u = scene.unit;
        const fa = 1 - smoothstep(7300, 8100, time);
        ctx.fillStyle = '#04080b';
        ctx.fillRect(0, 0, W, H);
        // the tube, glowing green and flickering
        const tube = smoothstep(200, 700, time) * (1 - smoothstep(2600, 3400, time));
        const fl = 0.65 + 0.35 * Math.sin(time / 37) * Math.sin(time / 113);
        const tx = W / 2;
        const ty = H * 0.16;
        drawGlow(ctx, tx, ty, 22 * u, '#5dff8a', 0.5 * tube * fl);
        ctx.strokeStyle = 'rgba(170,255,190,' + 0.7 * tube + ')';
        ctx.lineWidth = 0.35 * u;
        ctx.beginPath();
        ctx.ellipse(tx, ty, 11 * u, 6 * u, 0, 0, TAU);
        ctx.moveTo(tx - 11 * u, ty);
        ctx.lineTo(tx - 19 * u, ty);
        ctx.moveTo(tx + 11 * u, ty);
        ctx.lineTo(tx + 19 * u, ty);
        ctx.stroke();
        // the screen, then the hand revealed by a sweep
        const sw = Math.min(W * 0.8, H * 0.62);
        const sh = sw * 1.15;
        const scx = W / 2;
        const scy = H * 0.52;
        const scr = smoothstep(1800, 2600, time) * fa;
        ctx.fillStyle = 'rgba(14,26,34,' + scr + ')';
        ctx.fillRect(scx - sw / 2, scy - sh / 2, sw, sh);
        ctx.strokeStyle = 'rgba(120,200,255,' + 0.4 * scr + ')';
        ctx.lineWidth = 0.3 * u;
        ctx.strokeRect(scx - sw / 2, scy - sh / 2, sw, sh);
        const sweep = clamp((time - 2600) / 3000);
        const cut = scy - sh / 2 + sh * sweep;
        ctx.save();
        ctx.beginPath();
        ctx.rect(scx - sw / 2, scy - sh / 2, sw, sh * sweep);
        ctx.clip();
        const k = sw / 100;
        const wx = scx;
        const wy = scy + sh * 0.42;
        const bone = (x1, y1, x2, y2, w) => {
            ctx.lineWidth = w * k;
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.stroke();
        };
        ctx.lineCap = 'round';
        // soft tissue
        ctx.strokeStyle = 'rgba(110,170,210,' + 0.16 * fa + ')';
        const fingers = [[-48, 26, [14, 11]], [-16, 38, [24, 14, 10]], [-3, 40, [27, 16, 11]], [9, 38, [25, 15, 10]], [21, 34, [19, 11, 9]]];
        const joints = [];
        fingers.forEach(([deg, meta, ph], f) => {
            const a = (deg - 90) * Math.PI / 180;
            const bx = wx + (f - 2) * 5.2 * k + (f === 0 ? -4 * k : 0);
            const by = wy - 14 * k + (f === 0 ? 6 * k : 0);
            const mx = bx + Math.cos(a) * meta * k;
            const my = by + Math.sin(a) * meta * k;
            const pts = [[bx, by], [mx, my]];
            let x = mx;
            let y = my;
            const a2 = a + (f === 0 ? 0.25 : (f - 2) * 0.04);
            ph.forEach(l => {
                x += Math.cos(a2) * l * k;
                y += Math.sin(a2) * l * k;
                pts.push([x, y]);
            });
            joints.push(pts);
            bone(pts[0][0], pts[0][1], pts[pts.length - 1][0], pts[pts.length - 1][1], 9.5);
        });
        bone(wx - 20 * k, wy - 12 * k, wx + 18 * k, wy - 14 * k, 26);
        bone(wx - 9 * k, wy + 2 * k, wx - 9 * k, wy + 20 * k, 13);
        bone(wx + 9 * k, wy + 2 * k, wx + 9 * k, wy + 20 * k, 13);
        // bones
        ctx.strokeStyle = 'rgba(220,240,255,' + 0.85 * fa + ')';
        joints.forEach(pts => {
            for (let i = 0; i + 1 < pts.length; i++) {
                const [x1, y1] = pts[i];
                const [x2, y2] = pts[i + 1];
                const g = 0.12;
                bone(x1 + (x2 - x1) * g, y1 + (y2 - y1) * g, x2 - (x2 - x1) * g, y2 - (y2 - y1) * g, i === 0 ? 3.4 : 3 - i * 0.4);
            }
        });
        for (let i = 0; i < 8; i++) {
            const x = wx + (i % 4 - 1.5) * 5.6 * k;
            const y = wy - 6 * k + Math.floor(i / 4) * 5.4 * k;
            ctx.fillStyle = 'rgba(220,240,255,' + 0.8 * fa + ')';
            ctx.beginPath();
            ctx.ellipse(x, y, 2.4 * k, 2.1 * k, 0, 0, TAU);
            ctx.fill();
        }
        bone(wx - 9 * k, wy + 4 * k, wx - 9 * k, wy + 24 * k, 4.2);
        bone(wx + 9 * k, wy + 4 * k, wx + 9 * k, wy + 24 * k, 3.4);
        // the ring, on the ring finger's first bone
        const rp = joints[3];
        const rx = rp[1][0] + (rp[2][0] - rp[1][0]) * 0.45;
        const ry = rp[1][1] + (rp[2][1] - rp[1][1]) * 0.45;
        const glint = smoothstep(5900, 6200, time) * (1 - smoothstep(6400, 7600, time));
        drawGlow(ctx, rx, ry, (4 + 14 * glint) * k, '#ffcf5a', (0.5 + 0.5 * glint) * fa);
        ctx.strokeStyle = 'rgba(255,214,110,' + fa + ')';
        ctx.lineWidth = 1.6 * k;
        ctx.beginPath();
        ctx.ellipse(rx, ry, 3.6 * k, 1.5 * k, -0.15, 0, TAU);
        ctx.stroke();
        ctx.restore();
        if (sweep > 0 && sweep < 1) {
            ctx.fillStyle = 'rgba(160,220,255,.8)';
            ctx.fillRect(scx - sw / 2, cut - 0.3 * u, sw, 0.6 * u);
            drawGlow(ctx, scx, cut, sw * 0.4, '#7fd0ff', 0.3);
        }
        drawText(ctx, 'X-RAYS', W / 2, H * 0.05, 2.1 * u, '#9fe8b4', smoothstep(300, 900, time) * (1 - smoothstep(2600, 3200, time)), 600, 0.7 * u);
        drawText(ctx, 'WÜRZBURG · 1895', W / 2, H * 0.95, 2 * u, '#bfe4ff', smoothstep(6000, 6600, time) * fa, 600, 0.6 * u);
        const rb = smoothstep(7300, 8000, time);
        drawGlow(ctx, W / 2, H / 2, Math.max(W, H) * 0.7, '#6fd2ff', rb * 0.4 * (1 - smoothstep(8000, 9500, time) * 0.4));
        drawCard(ctx, scene, time, 7900, '#f2fbff', '#6fd2ff');
    }
};
// Ds: one atom lands in a detector in slow motion and lives for a fraction of a millisecond
CUTSCENES.Ds = {
    z: 110, dur: 10000,
    snd(audio, start) {
        padChord(audio, start, [61.7, 92.5, 123.5], 6.2, 0.013, 'sine', 600);
        playNoise(audio, start + 0.4, 0.8, 0.05, 300, 6000, 'bandpass', 2, 0.2, 0.6);
        playNoise(audio, start + 1.2, 0.08, 0.08, 4000, 800, 'lowpass', 1, 0.3, 0.002);
        playTone(audio, 1760, start + 1.2, 0.6, 0.02, 'sine', 880, 0.5, 0, 0.003);
        for (let i = 0; i < 16; i++) {
            playTone(audio, 2093, start + 1.6 + i * 0.28, 0.04, 0.008, 'square', null, 0.05, 0, 0.002);
        }
        playTone(audio, 220, start + 1.4, 4.6, 0.012, 'sine', 330, 0.4, 0, 1.5);
        playNoise(audio, start + 6, 0.1, 0.1, 9000, 2000, 'highpass', 1, 0.3, 0.001);
        boom(audio, start + 6, 0.16, 1.8);
        arp(audio, start + 6.1, [554.4, 659.3, 830.6, 1108.7], 0.1, 0.026, 'sine');
        padChord(audio, start + 7.4, [138.6, 207.7, 277.2, 415.3], 3, 0.02, 'sine', 2400);
        sparkle(audio, start + 7.8, 10, 2, 0.016);
    },
    draw(ctx, scene, time) {
        const W = scene.width;
        const H = scene.height;
        const u = scene.unit;
        const fa = 1 - smoothstep(7300, 8100, time);
        ctx.fillStyle = '#06070d';
        ctx.fillRect(0, 0, W, H);
        const n = 14;
        const cs = Math.min(W * 0.78, H * 0.56) / n;
        const gx = W / 2 - cs * n / 2;
        const gy = H * 0.52 - cs * n / 2;
        const hi = 8;
        const hj = 5;
        const hit = [gx + (hi + 0.5) * cs, gy + (hj + 0.5) * cs];
        const decay = time >= 6000;
        const dAge = time - 6000;
        // detector grid
        for (let i = 0; i < n; i++) {
            for (let j = 0; j < n; j++) {
                const d = Math.abs(i - hi) + Math.abs(j - hj);
                let lit = 0;
                if (decay && (i === hi || j === hj)) {
                    lit = Math.max(0, 1 - smoothstep(0, 1200, dAge - d * 60)) * (d < 7 ? 1 - d / 7 : 0);
                }
                ctx.fillStyle = 'rgba(' + (40 + 180 * lit) + ',' + (48 + 140 * lit) + ',' + (80 + 175 * lit) + ',' + (0.35 + 0.6 * lit) * fa + ')';
                ctx.fillRect(gx + i * cs + 0.12 * u, gy + j * cs + 0.12 * u, cs - 0.24 * u, cs - 0.24 * u);
            }
        }
        // the incoming ion
        const fly = clamp((time - 600) / 600);
        if (fly > 0 && fly < 1) {
            const x = -0.05 * W + (hit[0] + 0.05 * W) * fly;
            const y = H * 0.2 + (hit[1] - H * 0.2) * fly;
            ctx.strokeStyle = 'rgba(200,190,255,.7)';
            ctx.lineWidth = 0.4 * u;
            ctx.beginPath();
            ctx.moveTo(x - (hit[0] + 0.05 * W) * 0.12, y - (hit[1] - H * 0.2) * 0.12);
            ctx.lineTo(x, y);
            ctx.stroke();
            drawGlow(ctx, x, y, 4 * u, '#c8beff', 0.9);
        }
        // the atom, alive in its pixel
        if (time >= 1200 && !decay) {
            const p = 0.6 + 0.4 * Math.sin(time / 160);
            drawGlow(ctx, hit[0], hit[1], cs * 1.6, '#8a7dff', 0.6 * p);
            ctx.fillStyle = 'rgba(205,195,255,' + (0.7 + 0.3 * p) + ')';
            ctx.fillRect(hit[0] - cs / 2 + 0.12 * u, hit[1] - cs / 2 + 0.12 * u, cs - 0.24 * u, cs - 0.24 * u);
        }
        // the decay
        if (decay) {
            const r = clamp(dAge / 1100);
            drawGlow(ctx, hit[0], hit[1], (4 + 30 * r) * u, '#ffffff', (1 - r) * fa);
            ctx.strokeStyle = 'rgba(230,225,255,' + (1 - r) * fa + ')';
            ctx.lineWidth = (1 - r) * 1.2 * u;
            ctx.beginPath();
            ctx.arc(hit[0], hit[1], r * 40 * u, 0, TAU);
            ctx.stroke();
        }
        // slow-motion timer
        const life = clamp((time - 1200) / 4800);
        const us = Math.round(life * 180);
        const ta = smoothstep(1000, 1400, time) * fa;
        drawText(ctx, 'SLOW MOTION', W / 2, H * 0.07, 2.1 * u, '#b8b0ff', smoothstep(300, 900, time) * fa * (1 - smoothstep(5800, 6200, time)), 600, 0.7 * u);
        drawText(ctx, 'ONE ATOM · DECAYED', W / 2, H * 0.07, 2.1 * u, '#b8b0ff', smoothstep(6100, 6500, time) * fa, 600, 0.7 * u);
        drawText(ctx, (us / 1e6).toFixed(6) + ' s', W / 2, H * 0.13, 3.6 * u, decay ? '#ffffff' : '#e6e2ff', ta, 700, 0.3 * u);
        drawText(ctx, 'GSI · DARMSTADT · 1994', W / 2, H * 0.93, 2 * u, '#b8b0ff', smoothstep(6300, 6900, time) * fa, 600, 0.6 * u);
        const rb = smoothstep(7300, 8000, time);
        drawGlow(ctx, W / 2, H / 2, Math.max(W, H) * 0.7, '#8a7dff', rb * 0.4 * (1 - smoothstep(8000, 9500, time) * 0.4));
        drawCard(ctx, scene, time, 7900, '#f0eeff', '#8a7dff');
    }
};
// Mt: winter 1938 - a neutron strikes a drop-shaped nucleus, it stretches and splits (Meitner and Frisch explain fission)
CUTSCENES.Mt = {
    z: 109, dur: 10000,
    snd(audio, start) {
        padChord(audio, start, [73.4, 110, 146.8], 5.8, 0.013, 'sine', 700);
        playNoise(audio, start, 6, 0.022, 500, 900, 'bandpass', 0.7, 0.4, 1.5);
        playTone(audio, 1318.5, start + 1.8, 0.3, 0.02, 'sine', 659.3, 0.4, 0, 0.002);
        riser(audio, start + 2, 3.6, 0.026, 90, 420);
        for (let i = 0; i < 7; i++) {
            playTone(audio, 98 + i * 14, start + 2.2 + i * 0.48, 0.4, 0.012, 'triangle', null, 0.3, 0, 0.05);
        }
        playNoise(audio, start + 5.6, 0.15, 0.09, 7000, 1200, 'lowpass', 1, 0.3, 0.002);
        boom(audio, start + 5.6, 0.2, 2.2);
        arp(audio, start + 5.8, [293.7, 370, 440, 587.3, 740, 880], 0.11, 0.026, 'sine');
        padChord(audio, start + 7.4, [146.8, 220, 293.7, 440], 3, 0.02, 'sine', 2400);
        sparkle(audio, start + 7.8, 10, 2, 0.016);
    },
    draw(ctx, scene, time) {
        const W = scene.width;
        const H = scene.height;
        const u = scene.unit;
        const st = scene.state;
        const cx = W / 2;
        const cy = H * 0.48;
        const fa = 1 - smoothstep(7300, 8100, time);
        if (!st.snow) {
            const r = seededRandom(109);
            st.snow = Array.from({ length: 140 }, () => [r(), r(), 0.3 + r() * 0.9, r() * TAU]);
            st.nuc = Array.from({ length: 70 }, () => {
                const a = r() * TAU;
                const d = Math.sqrt(r());
                return [Math.cos(a) * d, Math.sin(a) * d, r()];
            });
        }
        const bg = ctx.createLinearGradient(0, 0, 0, H);
        bg.addColorStop(0, '#0d1a2b');
        bg.addColorStop(1, '#04070d');
        ctx.fillStyle = bg;
        ctx.fillRect(0, 0, W, H);
        // falling snow
        st.snow.forEach(([x, y, s, ph]) => {
            const yy = ((y + time * 0.00004 * (0.5 + s)) % 1) * H;
            const xx = ((x + Math.sin(time * 0.0006 + ph) * 0.012) % 1) * W;
            ctx.fillStyle = 'rgba(225,238,255,' + (0.2 + 0.45 * s) * fa + ')';
            ctx.beginPath();
            ctx.arc(xx, yy, (0.12 + 0.25 * s) * u, 0, TAU);
            ctx.fill();
        });
        const R = Math.min(W, H) * 0.16;
        const hitT = 1800;
        const splitT = 5600;
        // the neutron
        const fly = clamp((time - 900) / 900);
        if (fly > 0 && fly < 1) {
            const x = -0.04 * W + (cx - R + 0.04 * W) * fly * fly;
            ctx.strokeStyle = 'rgba(200,230,255,.6)';
            ctx.lineWidth = 0.35 * u;
            ctx.beginPath();
            ctx.moveTo(Math.max(0, x - 14 * u), cy);
            ctx.lineTo(x, cy);
            ctx.stroke();
            drawGlow(ctx, x, cy, 3 * u, '#d8ecff', 0.9);
        }
        if (time >= hitT && time < hitT + 500) {
            drawGlow(ctx, cx - R, cy, 9 * u, '#ffffff', (1 - (time - hitT) / 500) * 0.8);
        }
        if (time < splitT) {
            // the liquid drop: a Cassini oval that stretches toward a pinch
            const pre = smoothstep(hitT, splitT, time);
            const k = 0.985 * Math.pow(pre, 1.4);
            const wob = time < hitT ? Math.sin(time / 600) * 0.015 : Math.sin((time - hitT) / 170) * 0.07 * (1 - 0.6 * pre) * smoothstep(hitT, hitT + 400, time);
            const c2 = (k * R) * (k * R);
            const R4 = R * R * R * R;
            const shape = () => {
                ctx.beginPath();
                for (let i = 0; i <= 120; i++) {
                    const th = i / 120 * TAU;
                    const s2 = Math.sin(2 * th);
                    const rr = Math.sqrt(Math.max(0, c2 * Math.cos(2 * th) + Math.sqrt(Math.max(0, R4 - c2 * c2 * s2 * s2))));
                    const x = cx + Math.cos(th) * rr * (1 + wob);
                    const y = cy + Math.sin(th) * rr * (1 - wob);
                    if (i) {
                        ctx.lineTo(x, y);
                    } else {
                        ctx.moveTo(x, y);
                    }
                }
                ctx.closePath();
            };
            drawGlow(ctx, cx, cy, R * (2.6 + pre), '#ff8a3d', (0.25 + 0.35 * pre) * fa);
            const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, R * (1.2 + k * 0.5));
            g.addColorStop(0, '#fff6ec');
            g.addColorStop(0.55, '#ffbf8c');
            g.addColorStop(1, '#d0602e');
            ctx.fillStyle = g;
            shape();
            ctx.fill();
            ctx.save();
            shape();
            ctx.clip();
            st.nuc.forEach(([nx, ny, s]) => {
                ctx.fillStyle = 'rgba(150,60,20,' + (0.14 + 0.16 * s) + ')';
                ctx.beginPath();
                ctx.arc(cx + nx * R * (1 + k * 0.9) * (1 + wob), cy + ny * R * (1 - k * 0.4) * (1 - wob), 0.09 * R, 0, TAU);
                ctx.fill();
            });
            ctx.restore();
            ctx.strokeStyle = 'rgba(255,240,225,.75)';
            ctx.lineWidth = 0.3 * u;
            shape();
            ctx.stroke();
        } else {
            // two fragments fly apart with a burst of energy and spare neutrons
            const a = clamp((time - splitT) / 1600);
            const s = easeOutCubic(a);
            const d = R * 0.92 + s * Math.min(W * 0.3, H * 0.28);
            drawGlow(ctx, cx, cy, R * (1 + 6 * a), '#ffb070', (1 - a) * 0.95 * fa);
            ctx.strokeStyle = 'rgba(255,220,190,' + (1 - a) * fa + ')';
            ctx.lineWidth = (1 - a) * 1.4 * u;
            ctx.beginPath();
            ctx.arc(cx, cy, R * (0.5 + 6 * a), 0, TAU);
            ctx.stroke();
            [-1, 1].forEach(side => {
                const fx = cx + side * d;
                const rx = R * 0.58 * (1 + 0.3 * (1 - s));
                const ry = R * 0.58 * (1 - 0.2 * (1 - s));
                drawGlow(ctx, fx, cy, R * 1.6, '#ff8a3d', 0.4 * fa);
                const g = ctx.createRadialGradient(fx, cy, 0, fx, cy, rx * 1.2);
                g.addColorStop(0, '#fff6ec');
                g.addColorStop(0.55, '#ffbf8c');
                g.addColorStop(1, '#d0602e');
                ctx.globalAlpha = fa;
                ctx.fillStyle = g;
                ctx.beginPath();
                ctx.ellipse(fx, cy, rx, ry, 0, 0, TAU);
                ctx.fill();
                ctx.globalAlpha = 1;
            });
            [-2.3, -0.9, 1.9].forEach(ang => {
                const dist = easeOutCubic(clamp((time - splitT) / 900)) * Math.max(W, H) * 0.6;
                const x = cx + Math.cos(ang) * dist;
                const y = cy + Math.sin(ang) * dist;
                drawGlow(ctx, x, y, 2.6 * u, '#d8ecff', 0.9 * fa * (1 - a * 0.6));
            });
        }
        drawText(ctx, 'A WALK IN THE SNOW', W / 2, H * 0.07, 2.1 * u, '#cfe0ff', smoothstep(300, 900, time) * (1 - smoothstep(2600, 3200, time)), 600, 0.7 * u);
        drawText(ctx, 'THE NUCLEUS SPLITS', W / 2, H * 0.07, 2.1 * u, '#ffc9a3', smoothstep(5800, 6300, time) * fa, 600, 0.7 * u);
        drawText(ctx, 'MEITNER · FRISCH · 1938', W / 2, H * 0.93, 2 * u, '#cfe0ff', smoothstep(6100, 6700, time) * fa, 600, 0.6 * u);
        const rb = smoothstep(7300, 8000, time);
        drawGlow(ctx, W / 2, H / 2, Math.max(W, H) * 0.7, '#ff8a3d', rb * 0.4 * (1 - smoothstep(8000, 9500, time) * 0.4));
        drawCard(ctx, scene, time, 7900, '#fff1e6', '#ff8a3d');
    }
};
// Hs: hassium tetroxide molecules drift down a cold column and freeze out one at a time
CUTSCENES.Hs = {
    z: 108, dur: 10000,
    snd(audio, start) {
        padChord(audio, start, [69.3, 103.8, 138.6], 6, 0.013, 'sine', 700);
        playNoise(audio, start + 0.3, 5.6, 0.018, 1800, 600, 'lowpass', 0.5, 0.3, 1);
        for (let i = 0; i < 7; i++) {
            const t = start + (800 + i * 640 + 900) / 1000;
            playTone(audio, 659.3 * Math.pow(2, i * 2 / 12), t, 0.25, 0.016, 'sine', null, 0.5, 0, 0.003);
            playNoise(audio, t, 0.04, 0.03, 6000, 3000, 'highpass', 1, 0.2, 0.001);
        }
        playNoise(audio, start + 6, 0.1, 0.08, 8000, 1500, 'highpass', 1, 0.3, 0.002);
        boom(audio, start + 6, 0.16, 1.8);
        arp(audio, start + 6.1, [277.2, 349.2, 415.3, 554.4, 698.5], 0.11, 0.026, 'sine');
        padChord(audio, start + 7.4, [138.6, 207.7, 277.2, 415.3], 3, 0.02, 'sine', 2400);
        sparkle(audio, start + 7.8, 10, 2, 0.016);
    },
    draw(ctx, scene, time) {
        const W = scene.width;
        const H = scene.height;
        const u = scene.unit;
        const fa = 1 - smoothstep(7300, 8100, time);
        const bg = ctx.createRadialGradient(W / 2, H * 0.4, 0, W / 2, H * 0.4, Math.max(W, H) * 0.8);
        bg.addColorStop(0, '#1d0a1a');
        bg.addColorStop(1, '#070409');
        ctx.fillStyle = bg;
        ctx.fillRect(0, 0, W, H);
        const N = 7;
        const launch = i => 800 + i * 640;
        const arrived = Array.from({ length: N }, (_, i) => time >= launch(i) + 900).filter(Boolean).length;
        const lastArr = arrived ? launch(arrived - 1) + 900 : -1e9;
        const pulse = 1 - smoothstep(0, 500, time - lastArr);
        const big = time >= 6000 ? 1 - smoothstep(6000, 7000, time) : 0;
        // the column: a temperature gradient from +20 down to -170 C
        const x0 = W * 0.08;
        const x1 = W * 0.92;
        const cyc = H * 0.68;
        const th = Math.max(3 * u, H * 0.03);
        const colA = smoothstep(200, 900, time) * fa;
        const cg = ctx.createLinearGradient(x0, 0, x1, 0);
        cg.addColorStop(0, 'rgba(120,50,80,' + 0.55 * colA + ')');
        cg.addColorStop(1, 'rgba(30,70,140,' + 0.55 * colA + ')');
        ctx.fillStyle = cg;
        ctx.fillRect(x0, cyc - th / 2, x1 - x0, th);
        ctx.strokeStyle = 'rgba(255,200,230,' + 0.35 * colA + ')';
        ctx.lineWidth = 0.25 * u;
        ctx.strokeRect(x0, cyc - th / 2, x1 - x0, th);
        for (let i = 0; i <= 10; i++) {
            const x = x0 + (x1 - x0) * i / 10;
            ctx.fillStyle = 'rgba(255,200,230,' + 0.3 * colA + ')';
            ctx.fillRect(x - 0.1 * u, cyc + th / 2, 0.2 * u, i % 5 ? 0.8 * u : 1.4 * u);
        }
        drawText(ctx, '+20 °C', x0, cyc + th / 2 + 3.4 * u, 1.7 * u, '#ffb3d6', colA * 0.8, 600);
        drawText(ctx, '−170 °C', x1, cyc + th / 2 + 3.4 * u, 1.7 * u, '#a9c4ff', colA * 0.8, 600);
        const f = (20 + 44) / 190;
        const xd = x0 + (x1 - x0) * f;
        if (arrived) {
            drawGlow(ctx, xd, cyc, (5 + 6 * pulse + 18 * big) * u, '#ff4fb8', (0.4 + 0.4 * pulse + 0.5 * big) * fa);
            drawText(ctx, '−44 °C', xd, cyc - th / 2 - 3 * u, 2 * u, '#ffd6ec', smoothstep(1700, 2100, time) * fa, 700);
        }
        // molecules travelling and freezing out
        for (let i = 0; i < N; i++) {
            const t = time - launch(i);
            if (t < 0) {
                continue;
            }
            const jy = (((i * 37) % 7) / 6 - 0.5) * th * 0.6;
            const jx = (((i * 53) % 5) / 4 - 0.5) * 2.4 * u;
            const p = easeOutCubic(clamp(t / 900));
            const x = x0 - 3 * u + (xd + jx - x0 + 3 * u) * p;
            const y = cyc + jy;
            if (p < 1) {
                ctx.strokeStyle = 'rgba(255,120,200,.5)';
                ctx.lineWidth = 0.3 * u;
                ctx.beginPath();
                ctx.moveTo(Math.max(x0 - 3 * u, x - 8 * u * (1 - p)), y);
                ctx.lineTo(x, y);
                ctx.stroke();
            }
            drawGlow(ctx, x, y, 2.2 * u, '#ff7cc8', 0.8 * fa);
            ctx.fillStyle = 'rgba(255,230,245,' + fa + ')';
            ctx.beginPath();
            ctx.arc(x, y, 0.45 * u, 0, TAU);
            ctx.fill();
        }
        // a large HsO4 molecule turning above the column
        const mx = W / 2;
        const my = H * 0.36;
        const S = Math.min(W, H) * 0.15 * (1 + 0.05 * pulse + 0.08 * big) * (0.85 + 0.15 * smoothstep(0, 1200, time));
        const ma = smoothstep(0, 900, time) * fa;
        const ay = time * 0.0008;
        const ax = 0.6 + Math.sin(time * 0.0004) * 0.3;
        const k = 1 / Math.sqrt(3);
        const pts = [[0, 0, 0, 1], [k, k, k, 0], [k, -k, -k, 0], [-k, k, -k, 0], [-k, -k, k, 0]].map(([x, y, z, c]) => {
            const x2 = x * Math.cos(ay) + z * Math.sin(ay);
            const z2 = -x * Math.sin(ay) + z * Math.cos(ay);
            const y2 = y * Math.cos(ax) - z2 * Math.sin(ax);
            const z3 = y * Math.sin(ax) + z2 * Math.cos(ax);
            const p = 1 + z3 * 0.18;
            return { x: mx + x2 * S * p, y: my + y2 * S * p, z: z3, c, p };
        });
        drawGlow(ctx, mx, my, S * 3, '#ff4fb8', (0.22 + 0.3 * pulse + 0.5 * big) * ma);
        ctx.strokeStyle = 'rgba(255,190,225,' + 0.55 * ma + ')';
        ctx.lineWidth = 0.18 * S;
        ctx.lineCap = 'round';
        pts.slice(1).forEach(q => {
            ctx.beginPath();
            ctx.moveTo(pts[0].x, pts[0].y);
            ctx.lineTo(q.x, q.y);
            ctx.stroke();
        });
        pts.slice().sort((a, b) => a.z - b.z).forEach(q => {
            const r = (q.c ? 0.42 : 0.26) * S * q.p;
            const g = ctx.createRadialGradient(q.x - r * 0.35, q.y - r * 0.35, r * 0.1, q.x, q.y, r);
            if (q.c) {
                g.addColorStop(0, '#ffe2f3');
                g.addColorStop(0.45, '#ff4fb8');
                g.addColorStop(1, '#6a1048');
            } else {
                g.addColorStop(0, '#ffffff');
                g.addColorStop(0.5, '#ffc2e2');
                g.addColorStop(1, '#8a4a6c');
            }
            ctx.globalAlpha = ma;
            ctx.fillStyle = g;
            ctx.beginPath();
            ctx.arc(q.x, q.y, r, 0, TAU);
            ctx.fill();
            ctx.globalAlpha = 1;
        });
        drawText(ctx, 'HsO₄', mx, my + S * 1.75, 3.6 * u, '#ffe2f3', ma, 700, 0.2 * u);
        drawText(ctx, 'HASSIUM TETROXIDE', W / 2, H * 0.07, 2.1 * u, '#ffb3d6', smoothstep(300, 900, time) * (1 - smoothstep(5600, 6000, time)), 600, 0.7 * u);
        drawText(ctx, 'ONE MOLECULE AT A TIME', W / 2, H * 0.07, 2.1 * u, '#ffb3d6', smoothstep(6100, 6600, time) * fa, 600, 0.7 * u);
        drawText(ctx, 'HASSIA · THE LAND OF HESSE', W / 2, H * 0.93, 2 * u, '#ffd6ec', smoothstep(6300, 6900, time) * fa, 600, 0.6 * u);
        const rb = smoothstep(7300, 8000, time);
        drawGlow(ctx, W / 2, H / 2, Math.max(W, H) * 0.7, '#ff4fb8', rb * 0.4 * (1 - smoothstep(8000, 9500, time) * 0.4));
        drawCard(ctx, scene, time, 7900, '#fff0f8', '#ff4fb8');
    }
};
// Bh: Bohr's atom - an electron leaps between orbits and each fall paints a line of hydrogen's spectrum
CUTSCENES.Bh = {
    z: 107, dur: 10000,
    snd(audio, start) {
        padChord(audio, start, [65.4, 98, 130.8], 6.2, 0.013, 'sine', 700);
        const lam = [656, 486, 434, 410];
        [1700, 2900, 4100, 5300].forEach((t, i) => {
            const f = 440 * Math.pow(656 / lam[i], 2);
            playTone(audio, f * 2, start + t / 1000, 0.08, 0.014, 'triangle', f, 0.3, 0, 0.002);
            playTone(audio, f, start + t / 1000 + 0.7, 1.4, 0.02, 'sine', null, 0.6, 0, 0.004);
        });
        [2300, 3500, 4700].forEach(t => playTone(audio, 330, start + t / 1000 - 0.05, 0.2, 0.012, 'sine', 660, 0.3, 0, 0.01));
        playNoise(audio, start + 6.1, 0.1, 0.08, 8000, 1500, 'highpass', 1, 0.3, 0.002);
        boom(audio, start + 6.1, 0.16, 1.8);
        arp(audio, start + 6.2, [261.6, 329.6, 392, 523.3, 659.3], 0.11, 0.026, 'sine');
        padChord(audio, start + 7.4, [130.8, 196, 261.6, 392], 3, 0.02, 'sine', 2400);
        sparkle(audio, start + 7.8, 10, 2, 0.016);
    },
    draw(ctx, scene, time) {
        const W = scene.width;
        const H = scene.height;
        const u = scene.unit;
        const fa = 1 - smoothstep(7300, 8100, time);
        ctx.fillStyle = '#05070f';
        ctx.fillRect(0, 0, W, H);
        const cx = W / 2;
        const cy = H * 0.42;
        const Rm = Math.min(W * 0.42, H * 0.3);
        const rn = n => Rm * (0.1 + 0.9 * Math.pow((n - 1) / 5, 1.25));
        const lines = [[656, '#ff3b3b'], [486, '#3fd8ff'], [434, '#4f6bff'], [410, '#a35cff']];
        const ups = [3, 4, 5, 6];
        const tD = [1700, 2900, 4100, 5300];
        const tU = [2300, 3500, 4700];
        let n = 3;
        const ev = [];
        tD.forEach((t, i) => {
            ev.push([t, 2, ups[i], i, 'd']);
            if (tU[i]) {
                ev.push([tU[i], ups[i + 1], 2, i + 1, 'u']);
            }
        });
        ev.sort((a, b) => a[0] - b[0]);
        ev.forEach(e => {
            if (time >= e[0]) {
                n = e[1];
            }
        });
        const ang = time * 0.0018;
        const big = time >= 6100 ? 1 - smoothstep(6100, 7100, time) : 0;
        const oa = smoothstep(0, 900, time) * fa;
        // nucleus
        drawGlow(ctx, cx, cy, Rm * 0.25, '#ffd2d2', (0.5 + 0.4 * big) * oa);
        ctx.fillStyle = 'rgba(255,235,235,' + oa + ')';
        ctx.beginPath();
        ctx.arc(cx, cy, 0.9 * u, 0, TAU);
        ctx.fill();
        // orbits
        for (let k = 1; k <= 6; k++) {
            ctx.strokeStyle = 'rgba(150,180,255,' + (k === n ? 0.5 : 0.16 + 0.3 * big) * oa + ')';
            ctx.lineWidth = (k === n ? 0.3 : 0.18) * u;
            ctx.beginPath();
            ctx.arc(cx, cy, rn(k), 0, TAU);
            ctx.stroke();
        }
        // spectrum strip
        const sx0 = W * 0.1;
        const sx1 = W * 0.9;
        const sy = H * 0.82;
        const sh = Math.max(3 * u, H * 0.035);
        const lx = l => sx0 + (l - 380) / 320 * (sx1 - sx0);
        const sa = smoothstep(300, 1100, time) * fa;
        const rg = ctx.createLinearGradient(sx0, 0, sx1, 0);
        [[380, '#6a2cff'], [450, '#2c5cff'], [495, '#20d0ff'], [550, '#40ff70'], [590, '#ffe040'], [630, '#ff7a20'], [700, '#a01010']].forEach(([l, c]) => rg.addColorStop((l - 380) / 320, c));
        ctx.globalAlpha = 0.12 * sa;
        ctx.fillStyle = rg;
        ctx.fillRect(sx0, sy, sx1 - sx0, sh);
        ctx.globalAlpha = 1;
        ctx.strokeStyle = 'rgba(160,180,255,' + 0.3 * sa + ')';
        ctx.lineWidth = 0.2 * u;
        ctx.strokeRect(sx0, sy, sx1 - sx0, sh);
        // photons
        const P = (r, a) => [cx + Math.cos(a) * r, cy + Math.sin(a) * r];
        tD.forEach((t, i) => {
            const [l, col] = lines[i];
            const e = time - t;
            if (e < 0) {
                return;
            }
            const from = P(rn(2), t * 0.0018);
            const to = [lx(l), sy];
            const p = clamp(e / 800);
            if (p < 1) {
                const dx = to[0] - from[0];
                const dy = to[1] - from[1];
                const len = Math.hypot(dx, dy);
                const nx = -dy / len;
                const ny = dx / len;
                ctx.strokeStyle = col;
                ctx.lineWidth = 0.35 * u;
                ctx.beginPath();
                for (let s = Math.max(0, p - 0.3); s <= p + 1e-6; s += 0.01) {
                    const w = Math.sin(s * len / (2.2 * u)) * 1.2 * u;
                    const x = from[0] + dx * s + nx * w;
                    const y = from[1] + dy * s + ny * w;
                    if (s === Math.max(0, p - 0.3)) {
                        ctx.moveTo(x, y);
                    } else {
                        ctx.lineTo(x, y);
                    }
                }
                ctx.stroke();
                drawGlow(ctx, from[0] + dx * p, from[1] + dy * p, 3 * u, col, 0.9);
            } else {
                const fl = 1 - smoothstep(0, 600, e - 800);
                drawGlow(ctx, to[0], sy + sh / 2, (3 + 6 * fl + 6 * big) * u, col, (0.4 + 0.5 * fl + 0.4 * big) * fa);
                ctx.fillStyle = col;
                ctx.globalAlpha = fa;
                ctx.fillRect(to[0] - 0.3 * u, sy - 0.6 * u, 0.6 * u, sh + 1.2 * u);
                ctx.globalAlpha = 1;
                drawText(ctx, String(l), to[0], sy + sh + 2.4 * u, 1.6 * u, col, smoothstep(0, 400, e - 800) * fa, 700);
            }
        });
        // absorbed photons before each upward leap
        tU.forEach((t, i) => {
            const e = time - (t - 450);
            if (e < 0 || e > 450) {
                return;
            }
            const to = P(rn(2), t * 0.0018);
            const from = [W * 0.06, H * 0.1];
            const p = e / 450;
            drawGlow(ctx, from[0] + (to[0] - from[0]) * p, from[1] + (to[1] - from[1]) * p, 2.4 * u, lines[i + 1][1], 0.8);
        });
        // the quantum leap itself: no path between orbits, just a flash at both
        ev.forEach(([t, nTo, nFrom]) => {
            const e = time - t;
            if (e < 0 || e > 350) {
                return;
            }
            const a = 1 - e / 350;
            const p1 = P(rn(nFrom), ang);
            const p2 = P(rn(nTo), ang);
            drawGlow(ctx, p1[0], p1[1], 5 * u, '#ffffff', 0.6 * a);
            drawGlow(ctx, p2[0], p2[1], 6 * u, '#ffffff', 0.8 * a);
            ctx.setLineDash([0.6 * u, 0.9 * u]);
            ctx.strokeStyle = 'rgba(255,255,255,' + 0.5 * a + ')';
            ctx.lineWidth = 0.2 * u;
            ctx.beginPath();
            ctx.moveTo(p1[0], p1[1]);
            ctx.lineTo(p2[0], p2[1]);
            ctx.stroke();
            ctx.setLineDash([]);
        });
        if (time >= 600) {
            const [ex, ey] = P(rn(n), ang);
            drawGlow(ctx, ex, ey, 3.4 * u, '#bfe4ff', 0.9 * fa);
            ctx.fillStyle = 'rgba(240,250,255,' + fa + ')';
            ctx.beginPath();
            ctx.arc(ex, ey, 0.6 * u, 0, TAU);
            ctx.fill();
        }
        drawText(ctx, 'QUANTUM LEAPS', W / 2, H * 0.06, 2.1 * u, '#bcd0ff', smoothstep(300, 900, time) * (1 - smoothstep(5900, 6300, time)), 600, 0.7 * u);
        drawText(ctx, 'THE HYDROGEN SPECTRUM', W / 2, H * 0.06, 2.1 * u, '#bcd0ff', smoothstep(6200, 6700, time) * fa, 600, 0.7 * u);
        drawText(ctx, 'BOHR · 1913', W / 2, H * 0.95, 2 * u, '#bcd0ff', smoothstep(6400, 7000, time) * fa, 600, 0.6 * u);
        const rb = smoothstep(7300, 8000, time);
        drawGlow(ctx, W / 2, H / 2, Math.max(W, H) * 0.7, '#4f86ff', rb * 0.4 * (1 - smoothstep(8000, 9500, time) * 0.4));
        drawCard(ctx, scene, time, 7900, '#eef3ff', '#4f86ff');
    }
};
// Sg: Seaborg lifts the actinides out of the main table, and element 106 takes the place uranium left
CUTSCENES.Sg = {
    z: 106, dur: 10000,
    snd(audio, start) {
        padChord(audio, start, [82.4, 123.5, 164.8], 6, 0.013, 'sine', 700);
        for (let i = 0; i < 10; i++) {
            playNoise(audio, start + 0.3 + i * 0.1, 0.03, 0.025, 4000, 2500, 'bandpass', 2, 0.2, 0.001);
        }
        playTone(audio, 523.3, start + 2.4, 0.5, 0.018, 'sine', null, 0.5, 0, 0.01);
        for (let i = 0; i < 5; i++) {
            playTone(audio, 392 - i * 22, start + 2.9 + i * 0.14, 0.9, 0.014, 'triangle', 196 - i * 11, 0.4, 0, 0.01);
        }
        [4.3, 4.55].forEach(t => sparkle(audio, start + t, 3, 0.2, 0.014));
        for (let i = 0; i < 7; i++) {
            playNoise(audio, start + 4.9 + i * 0.09, 0.03, 0.022, 4500, 2800, 'bandpass', 2, 0.2, 0.001);
        }
        playTone(audio, 659.3, start + 5.5, 0.4, 0.014, 'sine', null, 0.4, 0, 0.005);
        playTone(audio, 784, start + 5.75, 0.4, 0.014, 'sine', null, 0.4, 0, 0.005);
        playNoise(audio, start + 6, 0.1, 0.08, 8000, 1500, 'highpass', 1, 0.3, 0.002);
        boom(audio, start + 6, 0.17, 1.8);
        arp(audio, start + 6.1, [329.6, 415.3, 493.9, 659.3, 830.6], 0.11, 0.026, 'sine');
        padChord(audio, start + 7.4, [164.8, 246.9, 329.6, 493.9], 3, 0.02, 'sine', 2400);
        sparkle(audio, start + 7.8, 10, 2, 0.016);
    },
    draw(ctx, scene, time) {
        const W = scene.width;
        const H = scene.height;
        const u = scene.unit;
        const st = scene.state;
        const fa = 1 - smoothstep(7300, 8100, time);
        ctx.fillStyle = '#050c09';
        ctx.fillRect(0, 0, W, H);
        if (!st.cells) {
            const rows = [
                [[1, 'H'], [18, 'He']],
                [[1, 'Li'], [2, 'Be'], [13, 'B'], [14, 'C'], [15, 'N'], [16, 'O'], [17, 'F'], [18, 'Ne']],
                [[1, 'Na'], [2, 'Mg'], [13, 'Al'], [14, 'Si'], [15, 'P'], [16, 'S'], [17, 'Cl'], [18, 'Ar']],
                'K Ca Sc Ti V Cr Mn Fe Co Ni Cu Zn Ga Ge As Se Br Kr'.split(' ').map((s, i) => [i + 1, s]),
                'Rb Sr Y Zr Nb Mo Tc Ru Rh Pd Ag Cd In Sn Sb Te I Xe'.split(' ').map((s, i) => [i + 1, s]),
                'Cs Ba La Hf Ta W Re Os Ir Pt Au Hg Tl Pb Bi Po At Rn'.split(' ').map((s, i) => [i + 1, s]),
                [[1, 'Fr'], [2, 'Ra'], [3, 'Ac']]
            ];
            st.cells = [];
            rows.forEach((r, ri) => r.forEach(([c, s]) => st.cells.push({ s, c, r: ri, t: 200 + ri * 90 + c * 25 })));
            'Ce Pr Nd Pm Sm Eu Gd Tb Dy Ho Er Tm Yb Lu'.split(' ').forEach((s, i) => st.cells.push({ s, c: i + 4, r: 7.6, t: 900 + i * 25 }));
            // the elements Seaborg moved: they start under hafnium..osmium in period 7
            'Th Pa U Np Pu'.split(' ').forEach((s, i) => st.cells.push({ s, c: i + 4, r: 6, t: 800 + i * 25, mv: 2900 + i * 140 }));
            'Am Cm'.split(' ').forEach((s, i) => st.cells.push({ s, c: i + 9, r: 8.6, t: 4300 + i * 250, hot: 1 }));
            'Bk Cf Es Fm Md No Lr'.split(' ').forEach((s, i) => st.cells.push({ s, c: i + 11, r: 8.6, t: 4900 + i * 90 }));
            [['Rf', 4, 5500], ['Db', 5, 5750], ['Sg', 6, 6000]].forEach(([s, c, t]) => st.cells.push({ s, c, r: 6, t, hot: s === 'Sg' ? 2 : 1 }));
            'Bh Hs Mt Ds Rg Cn Nh Fl Mc Lv Ts Og'.split(' ').forEach((s, i) => st.cells.push({ s, c: i + 7, r: 6, t: 6300 + i * 60 }));
        }
        const cs = Math.min(W * 0.92 / 18, H * 0.6 / 9.6);
        const gx = W / 2 - 9 * cs;
        const gy = H * 0.5 - 4.8 * cs;
        const sgx = gx + 5.5 * cs;
        const sgy = gy + 6.5 * cs;
        const zm = 1 + 1.1 * smoothstep(6000, 7300, time);
        const zc = smoothstep(6000, 7300, time);
        ctx.save();
        ctx.translate(W / 2, H / 2);
        ctx.scale(zm, zm);
        ctx.translate(-(W / 2 + (sgx - W / 2) * zc), -(H / 2 + (sgy - H / 2) * zc));
        const showSym = cs * zm >= 18;
        st.cells.forEach(cell => {
            const a = smoothstep(cell.t, cell.t + 350, time);
            if (a <= 0) {
                return;
            }
            let row = cell.r;
            let glow = 0;
            if (cell.mv) {
                glow = smoothstep(2300, 2700, time) * (1 - smoothstep(cell.mv + 1100, cell.mv + 1800, time));
                const p = clamp((time - cell.mv) / 1000);
                const e = p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;
                row = 6 + (8.6 - 6) * e;
                if (p > 0 && p < 1) {
                    drawGlow(ctx, gx + (cell.c - 0.5) * cs, gy + (row + 0.5) * cs, cs * 1.4, '#4fe08a', 0.5);
                }
            }
            if (cell.hot) {
                glow = Math.max(glow, (1 - smoothstep(cell.t + 300, cell.t + (cell.hot === 2 ? 1e9 : 1500), time)));
            }
            const x = gx + (cell.c - 1) * cs;
            const y = gy + row * cs;
            const big = cell.hot === 2 ? 1 - smoothstep(6000, 6900, time) : 0;
            if (cell.hot === 2) {
                drawGlow(ctx, x + cs / 2, y + cs / 2, cs * (2 + 5 * big), '#4fe08a', (0.5 + 0.5 * big) * fa);
            }
            ctx.globalAlpha = a * fa;
            ctx.fillStyle = glow > 0 ? 'rgba(79,224,138,' + (0.12 + 0.6 * glow) + ')' : 'rgba(120,200,160,.10)';
            ctx.fillRect(x + 0.08 * cs, y + 0.08 * cs, cs * 0.84, cs * 0.84);
            ctx.strokeStyle = glow > 0 ? 'rgba(170,255,200,' + (0.3 + 0.6 * glow) + ')' : 'rgba(120,220,170,.28)';
            ctx.lineWidth = Math.max(0.5, 0.05 * cs);
            ctx.strokeRect(x + 0.08 * cs, y + 0.08 * cs, cs * 0.84, cs * 0.84);
            ctx.globalAlpha = 1;
            if (showSym || glow > 0.2) {
                drawText(ctx, cell.s, x + cs / 2, y + cs / 2 + 0.03 * cs, cs * 0.4, glow > 0.2 ? '#eafff1' : '#9fd8b8', a * fa * (glow > 0.2 ? 1 : 0.55), 700);
            }
        });
        ctx.restore();
        drawText(ctx, 'THE TABLE · 1944', W / 2, H * 0.07, 2.1 * u, '#9fe8bf', smoothstep(300, 900, time) * (1 - smoothstep(2200, 2600, time)), 600, 0.7 * u);
        drawText(ctx, 'SEABORG MOVES THE ACTINIDES', W / 2, H * 0.07, 2.1 * u, '#9fe8bf', smoothstep(2500, 3000, time) * (1 - smoothstep(5600, 6000, time)), 600, 0.7 * u);
        drawText(ctx, 'NAMED FOR A LIVING SCIENTIST', W / 2, H * 0.07, 2.1 * u, '#9fe8bf', smoothstep(6200, 6700, time) * fa, 600, 0.7 * u);
        drawText(ctx, 'GLENN T. SEABORG · 1912–1999', W / 2, H * 0.93, 2 * u, '#9fe8bf', smoothstep(6400, 7000, time) * fa, 600, 0.6 * u);
        const rb = smoothstep(7300, 8000, time);
        drawGlow(ctx, W / 2, H / 2, Math.max(W, H) * 0.7, '#4fe08a', rb * 0.4 * (1 - smoothstep(8000, 9500, time) * 0.4));
        drawCard(ctx, scene, time, 7900, '#effff5', '#4fe08a');
    }
};
// Db: the Transfermium Wars - a split-flap board cycles through every name 105 was given until it settles
CUTSCENES.Db = {
    z: 105, dur: 10000,
    seq: [[700, 'NIELSBOHRIUM', '1968', 'DUBNA'], [1900, 'HAHNIUM', '1970', 'BERKELEY'], [2800, 'NIELSBOHRIUM', '1970', 'DUBNA'], [3400, 'HAHNIUM', '1970', 'BERKELEY'], [4000, 'UNNILPENTIUM', '1978', 'IUPAC · PLACEHOLDER'], [4800, 'JOLIOTIUM', '1994', 'IUPAC'], [5600, 'DUBNIUM', '1997', 'IUPAC · FINAL']],
    snd(audio, start) {
        padChord(audio, start, [77.8, 116.5, 155.6], 6, 0.013, 'sine', 700);
        this.seq.forEach(([t], i) => {
            for (let k = 0; k < 14; k++) {
                playNoise(audio, start + t / 1000 + 0.05 + k * 0.05 + Math.random() * 0.02, 0.014, 0.05, 3500, 2500, 'bandpass', 2, 0.1, 0.001);
            }
            playTone(audio, 196 + i * 18, start + t / 1000 + 0.75, 0.25, 0.012, 'triangle', null, 0.3, 0, 0.004);
        });
        playNoise(audio, start + 6.4, 0.1, 0.08, 8000, 1500, 'highpass', 1, 0.3, 0.002);
        boom(audio, start + 6.4, 0.17, 1.8);
        arp(audio, start + 6.5, [311.1, 392, 466.2, 622.3, 784], 0.11, 0.026, 'sine');
        padChord(audio, start + 7.5, [155.6, 233.1, 311.1, 466.2], 3, 0.02, 'sine', 2400);
        sparkle(audio, start + 7.8, 10, 2, 0.016);
    },
    draw(ctx, scene, time) {
        const W = scene.width;
        const H = scene.height;
        const u = scene.unit;
        const fa = 1 - smoothstep(7300, 8100, time);
        const bg = ctx.createRadialGradient(W / 2, H * 0.47, 0, W / 2, H * 0.47, Math.max(W, H) * 0.75);
        bg.addColorStop(0, '#13160c');
        bg.addColorStop(1, '#050604');
        ctx.fillStyle = bg;
        ctx.fillRect(0, 0, W, H);
        const seq = this.seq;
        let idx = -1;
        seq.forEach((s, i) => {
            if (time >= s[0]) {
                idx = i;
            }
        });
        const final = idx === seq.length - 1;
        const settle = smoothstep(6350, 6700, time);
        const big = time >= 6400 ? 1 - smoothstep(6400, 7300, time) : 0;
        const AZ = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const pad = (s, n) => {
            const l = Math.floor((n - s.length) / 2);
            return (' '.repeat(l) + s + ' '.repeat(n)).slice(0, n);
        };
        const flap = (str, prev, n, cw, ch, x0, y, set, digits) => {
            for (let j = 0; j < n; j++) {
                const x = x0 + j * cw;
                const target = str[j];
                const before = prev ? prev[j] : ' ';
                const tc = idx >= 0 ? seq[idx][0] : 0;
                const dj = 120 + j * 45 + ((j * 7 + set * 13) % 5) * 35;
                const flipping = idx >= 0 && time < tc + dj && (target !== before || target !== ' ');
                let chr = target;
                if (flipping) {
                    const step = Math.floor((time - tc) / 55);
                    const h = (Math.imul(j + 1, 2654435761) ^ Math.imul(step + 1, 40503) ^ Math.imul(set + 1, 9973)) >>> 0;
                    chr = digits ? String(h % 10) : AZ[(h >>> 3) % 26];
                }
                ctx.globalAlpha = A;
                ctx.fillStyle = '#14170e';
                ctx.fillRect(x + 0.06 * cw, y - ch / 2, cw * 0.88, ch);
                ctx.fillStyle = flipping ? '#262b1a' : '#1b1f13';
                ctx.fillRect(x + 0.06 * cw, y - ch / 2, cw * 0.88, ch / 2);
                ctx.globalAlpha = 1;
                const col = final && !flipping ? '#d4ff3a' : '#eaffc0';
                if (chr !== ' ') {
                    drawText(ctx, chr, x + cw / 2, y + ch * 0.03, ch * 0.62, col, A * (flipping ? 0.8 : 1), 700);
                }
                ctx.fillStyle = 'rgba(0,0,0,' + 0.75 * A + ')';
                ctx.fillRect(x + 0.06 * cw, y - 0.04 * ch, cw * 0.88, Math.max(1, 0.05 * ch));
            }
        };
        const N = 12;
        const cw = Math.min(W * 0.88 / N, H * 0.075);
        const ch = cw * 1.45;
        const by = H * 0.47;
        const ba = smoothstep(0, 600, time) * fa;
        const A = ba;
        drawGlow(ctx, W / 2, by, W * 0.5, '#c6f03a', (0.12 + 0.5 * settle * (final ? 1 : 0) * (0.5 + big)) * ba);
        const cur = idx >= 0 ? seq[idx] : [0, '', '    ', ''];
        const prv = idx > 0 ? seq[idx - 1] : [0, '', '    ', ''];
        flap(pad(cur[1], N), pad(prv[1], N), N, cw, ch, W / 2 - N * cw / 2, by, idx + 1, false);
        const yw = cw * 0.8;
        flap(cur[2].padEnd(4), prv[2].padEnd(4), 4, yw, yw * 1.45, W / 2 - 2 * yw, by - ch * 1.6, idx + 7, true);
        if (idx >= 0) {
            drawText(ctx, cur[3], W / 2, by + ch * 1.15, 2 * u, final ? '#d4ff3a' : '#c8d8a0', smoothstep(cur[0] + 600, cur[0] + 900, time) * fa, 600, 0.6 * u);
        }
        drawText(ctx, 'THE TRANSFERMIUM WARS', W / 2, H * 0.07, 2.1 * u, '#c8e88a', smoothstep(300, 900, time) * (1 - smoothstep(5600, 6000, time)), 600, 0.7 * u);
        drawText(ctx, 'ONE ELEMENT · FIVE NAMES', W / 2, H * 0.07, 2.1 * u, '#c8e88a', smoothstep(6300, 6800, time) * fa, 600, 0.7 * u);
        drawText(ctx, 'NAMED FOR DUBNA', W / 2, H * 0.93, 2 * u, '#c8e88a', smoothstep(6500, 7100, time) * fa, 600, 0.6 * u);
        const rb = smoothstep(7300, 8000, time);
        drawGlow(ctx, W / 2, H / 2, Math.max(W, H) * 0.7, '#c6f03a', rb * 0.4 * (1 - smoothstep(8000, 9500, time) * 0.4));
        drawCard(ctx, scene, time, 7900, '#f8ffe6', '#c6f03a');
    }
};
// cutscenes for the joke elements
// Um: a serious build-up, then a party popper
CUTSCENES.Um = {
    z: 0, dur: 8200,
    snd(audio, start) {
        padChord(audio, start, [55, 82.4], 3.4, 0.014, 'sine', 500);
        [0.8, 1.6, 2.2, 2.7, 3.05, 3.3].forEach(x => playTone(audio, 880, start + x, 0.08, 0.02, 'sine', null, 0.3));
        playNoise(audio, start + 3.6, 0.25, 0.12, 3000, 400, 'bandpass', 1, 0.2, 0.002);
        [523.3, 659.3, 784, 1046.5].forEach((f, i) => playTone(audio, f, start + 3.7 + i * 0.11, 0.18, 0.03, 'square', null, 0.2, 0, 0.005));
        sparkle(audio, start + 3.7, 14, 1.6, 0.02);
        padChord(audio, start + 4.3, [261.6, 329.6, 392], 2.8, 0.016, 'triangle', 2400);
    },
    draw(ctx, scene, time) {
        const W = scene.width;
        const H = scene.height;
        const u = scene.unit;
        const cx = W / 2;
        const cy = H / 2;
        const st = scene.state;
        if (!st.c) {
            const r = seededRandom(7);
            const cols = ['#ff5d7a', '#ffd166', '#5eead4', '#7cc8ff', '#b39dff', '#f78fd8'];
            st.c = Array.from({ length: 140 }, () => {
                const a = -Math.PI / 2 + (r() - 0.5) * 2.6;
                const v = (0.5 + r() * 1.2) * u;
                return [Math.cos(a) * v, Math.sin(a) * v, cols[Math.floor(r() * cols.length)], r() * TAU, r() * 0.02 + 0.005, r() < 0.3];
            });
        }
        const pop = 3600;
        const b = smoothstep(0, 3200, time);
        const after = time >= pop;
        ctx.fillStyle = after ? '#2b1640' : '#04070d';
        ctx.fillRect(0, 0, W, H);
        if (!after) {
            // this is meant to look like every other cutscene's opening
            const shake = smoothstep(2600, pop, time) * 0.8 * u * (calmFx ? 0.3 : 1);
            const sx = Math.sin(time / 23) * shake;
            drawGlow(ctx, cx + sx, cy, 40 * u * (0.6 + 0.4 * b), '#2d6bff', 0.6 * b);
            ctx.fillStyle = '#9cc4ff';
            ctx.beginPath();
            ctx.arc(cx + sx, cy, (3 + 2 * b + Math.sin(time / 180) * 0.4) * u, 0, TAU);
            ctx.fill();
            drawText(ctx, 'INITIATING SEQUENCE', cx, H - 6 * u, 2.2 * u, '#7aa7ff', b * (0.6 + 0.4 * Math.sin(time / 300)), 600, 0.6 * u);
            return;
        }
        const d = time - pop;
        drawGlow(ctx, cx, cy, 70 * u, '#ff9a5c', 0.5 * (1 - smoothstep(0, 1200, d)));
        // confetti
        st.c.forEach(([vx, vy, col, a0, spin, strip]) => {
            const x = cx + vx * d / 16;
            const y = cy + vy * d / 16 + 0.00006 * u * d * d;
            if (y > H + 4 * u) {
                return;
            }
            ctx.save();
            ctx.translate(x, y);
            ctx.rotate(a0 + d * spin);
            ctx.fillStyle = col;
            ctx.globalAlpha = 1 - smoothstep(3200, 4400, d);
            if (strip) {
                ctx.fillRect(-0.3 * u, -1.6 * u, 0.6 * u, 3.2 * u);
            } else {
                ctx.fillRect(-0.7 * u, -0.45 * u, 1.4 * u, 0.9 * u);
            }
            ctx.restore();
        });
        const k = easeOutCubic(d / 500);
        const bounce = 1 + 0.12 * Math.sin(d / 70) * (1 - smoothstep(0, 900, d));
        const out = 1 - smoothstep(2000, 2500, d);
        drawText(ctx, 'SURPRISE!', cx, cy - 4 * u, 12 * u * k * bounce, '#ffd166', out, 800, 0.4 * u);
        drawCard(ctx, scene, time, 6000, '#ffd166', '#ff5d7a');
    }
};
// Zz: a sleeping atom ignores a poke and an alarm clock, then jolts awake
CUTSCENES.Zz = {
    z: 0, dur: 8600,
    snd(audio, start) {
        for (let x = 0.2; x < 5; x += 1.3) {
            playNoise(audio, start + x, 0.7, 0.03, 180, 420, 'lowpass', 4, 0.1, 0.3);
        }
        playTone(audio, 900, start + 1.6, 0.06, 0.03, 'triangle', 700, 0.1);
        for (let i = 0; i < 16; i++) {
            playTone(audio, i % 2 ? 1320 : 1480, start + 3 + i * 0.09, 0.07, 0.02, 'square', null, 0.15, 0, 0.003);
        }
        riser(audio, start + 4.7, 0.6, 0.03, 200, 1800);
        boom(audio, start + 5.3, 0.06, 0.8);
        sparkle(audio, start + 5.35, 10, 1.2, 0.02);
    },
    draw(ctx, scene, time) {
        const W = scene.width;
        const H = scene.height;
        const u = scene.unit;
        const cx = W / 2;
        const cy = H / 2 + 4 * u;
        const wake = 5300;
        const up = time >= wake;
        const d = time - wake;
        ctx.fillStyle = up ? '#14243a' : '#070b1a';
        ctx.fillRect(0, 0, W, H);
        const fade = 1 - smoothstep(6200, 6800, time);
        drawGlow(ctx, cx, cy, 30 * u, up ? '#7cc8ff' : '#3b4b8f', (up ? 0.7 * (1 - smoothstep(0, 1500, d)) + 0.3 : 0.35) * fade);
        ctx.globalAlpha = fade;
        // a poke and a wobble
        const poke = smoothstep(1300, 1600, time) * (1 - smoothstep(1700, 2000, time));
        const wob = Math.sin(time / 40) * Math.max(0, 1 - Math.abs(time - 1650) / 400) * u;
        // the alarm clock rattles to the side
        const ring = time > 3000 && time < 4500;
        const shake = ring ? Math.sin(time / 18) * 0.6 * u * (calmFx ? 0.4 : 1) : 0;
        const jolt = up ? Math.sin(d / 25) * 2 * u * (1 - smoothstep(0, 500, d)) * (calmFx ? 0.3 : 1) : 0;
        const x = cx + wob + jolt;
        // orbits, slow while asleep
        const spin = up ? time / 140 : time / 1400;
        ctx.strokeStyle = 'rgba(150,180,255,0.35)';
        ctx.lineWidth = 0.3 * u;
        for (let i = 0; i < 2; i++) {
            ctx.beginPath();
            ctx.ellipse(x, cy, 14 * u, 5 * u, i * 1.2 - 0.6, 0, TAU);
            ctx.stroke();
            const a = spin * (i ? 1.3 : 1) + i;
            const ex = Math.cos(a) * 14 * u;
            const ey = Math.sin(a) * 5 * u;
            const r = i * 1.2 - 0.6;
            ctx.fillStyle = '#bcd2ff';
            ctx.beginPath();
            ctx.arc(x + ex * Math.cos(r) - ey * Math.sin(r), cy + ex * Math.sin(r) + ey * Math.cos(r), 0.9 * u, 0, TAU);
            ctx.fill();
        }
        ctx.fillStyle = up ? '#9fd3ff' : '#6d7fc4';
        ctx.beginPath();
        ctx.arc(x, cy, 6 * u, 0, TAU);
        ctx.fill();
        // eyes
        ctx.strokeStyle = '#0b1230';
        ctx.fillStyle = '#0b1230';
        ctx.lineWidth = 0.5 * u;
        [-1, 1].forEach(s => {
            ctx.beginPath();
            if (up) {
                ctx.arc(x + s * 2 * u, cy - 0.8 * u, 1.1 * u, 0, TAU);
                ctx.fill();
            } else {
                ctx.arc(x + s * 2 * u, cy - 1.2 * u, 1 * u, 0.2, Math.PI - 0.2);
                ctx.stroke();
            }
        });
        // z's drift up while it sleeps
        if (!up) {
            for (let i = 0; i < 4; i++) {
                const p = ((time / 2200 + i / 4) % 1);
                const big = ring ? 1.6 : 1;
                drawText(ctx, 'z', x + 6 * u + p * 10 * u, cy - 6 * u - p * 22 * u, (2 + 3 * p) * u * big, '#9aa8ff', Math.sin(p * Math.PI) * 0.9, 700);
            }
        } else {
            drawText(ctx, '!', x, cy - 14 * u, 8 * u * easeOutCubic(d / 300), '#ffd166', 1 - smoothstep(1200, 1700, d), 800);
        }
        ctx.globalAlpha = 1;
        // the finger
        if (poke > 0) {
            ctx.fillStyle = '#f2c7a5';
            ctx.beginPath();
            ctx.roundRect(cx - 30 * u + poke * 16 * u, cy - u, 14 * u, 2.6 * u, 1.3 * u);
            ctx.fill();
            drawText(ctx, 'poke', cx - 20 * u, cy - 6 * u, 2.4 * u, '#f2c7a5', poke, 600);
        }
        // the clock
        const ca = smoothstep(2700, 3000, time) * (1 - smoothstep(4500, 4900, time));
        if (ca > 0) {
            const kx = W * 0.78 + shake;
            const ky = cy - 2 * u;
            ctx.globalAlpha = ca;
            ctx.fillStyle = '#d14d4d';
            ctx.beginPath();
            ctx.arc(kx, ky, 6 * u, 0, TAU);
            ctx.fill();
            [-1, 1].forEach(s => {
                ctx.beginPath();
                ctx.arc(kx + s * 4.5 * u, ky - 5.5 * u, 2 * u, 0, TAU);
                ctx.fill();
            });
            ctx.fillStyle = '#f6efe3';
            ctx.beginPath();
            ctx.arc(kx, ky, 4.6 * u, 0, TAU);
            ctx.fill();
            ctx.strokeStyle = '#222';
            ctx.lineWidth = 0.4 * u;
            ctx.beginPath();
            ctx.moveTo(kx, ky);
            ctx.lineTo(kx, ky - 3.2 * u);
            ctx.moveTo(kx, ky);
            ctx.lineTo(kx + 2.2 * u, ky);
            ctx.stroke();
            ctx.globalAlpha = 1;
            if (ring) {
                drawText(ctx, 'RING RING', kx, ky - 11 * u, 2.6 * u, '#ff8a8a', 0.6 + 0.4 * Math.sin(time / 50), 700, 0.3 * u);
            }
        }
        drawCard(ctx, scene, time, 6600, '#9fd3ff', '#3b6bff');
    }
};
// Mu: nothing happens, slowly, then a very small ding
CUTSCENES.Mu = {
    z: 0, dur: 8200,
    snd(audio, start) {
        for (let i = 0; i < 12; i++) {
            playTone(audio, 220, start + 1 + i * 0.38, 0.03, 0.008, 'sine', null, 0.05);
        }
        playTone(audio, 1568, start + 5.7, 0.5, 0.012, 'sine', null, 0.4);
    },
    draw(ctx, scene, time) {
        const W = scene.width;
        const H = scene.height;
        const u = scene.unit;
        const cx = W / 2;
        const cy = H / 2;
        const dim = smoothstep(5900, 6400, time);
        const g = Math.round(232 - 160 * dim);
        ctx.fillStyle = 'rgb(' + g + ',' + (g - 6) + ',' + (g - 20) + ')';
        ctx.fillRect(0, 0, W, H);
        const a = smoothstep(200, 900, time) * (1 - dim);
        ctx.globalAlpha = a;
        ctx.fillStyle = '#9b978d';
        ctx.fillRect(cx - 7 * u, cy - 14 * u, 14 * u, 14 * u);
        ctx.globalAlpha = 1;
        drawText(ctx, 'A grey square', cx, cy + 5 * u, 2.4 * u, '#6f6b62', a, 500);
        // a loading bar that takes its time
        const p = Math.floor(smoothstep(1000, 5500, time) * 12) / 12;
        ctx.globalAlpha = a;
        ctx.strokeStyle = '#8c887e';
        ctx.lineWidth = 0.3 * u;
        ctx.strokeRect(cx - 20 * u, cy + 11 * u, 40 * u, 2.4 * u);
        ctx.fillStyle = '#a9a59a';
        ctx.fillRect(cx - 20 * u, cy + 11 * u, 40 * u * p, 2.4 * u);
        ctx.globalAlpha = 1;
        const blip = time > 3900 && time < 4100;
        drawText(ctx, 'Excitement: ' + (blip ? '1' : '0') + '%', cx, cy + 18 * u, 2 * u, '#6f6b62', a, 500);
        // the ding
        const ding = time - 5700;
        if (ding > 0 && ding < 700) {
            const k = 1 - ding / 700;
            ctx.strokeStyle = 'rgba(120,116,106,' + k + ')';
            ctx.lineWidth = 0.25 * u;
            ctx.beginPath();
            ctx.arc(cx + 7 * u, cy - 14 * u, (1 + ding / 120) * u, 0, TAU);
            ctx.stroke();
            drawText(ctx, 'ding', cx + 12 * u, cy - 18 * u, 1.8 * u, '#6f6b62', k, 500);
        }
        drawCard(ctx, scene, time, 6500, '#d8d2c4', '#8f8a7e');
    }
};
// Ln: a torch searches the lab and it's in the last drawer
CUTSCENES.Ln = {
    z: 0, dur: 9000,
    snd(audio, start) {
        [0.6, 1.4, 2.1].forEach(x => playNoise(audio, start + x, 0.12, 0.02, 600, 300, 'lowpass', 1, 0.1));
        [2.9, 3.6, 4.3, 5].forEach(x => playNoise(audio, start + x, 0.22, 0.035, 900, 400, 'bandpass', 2, 0.15));
        playNoise(audio, start + 5.8, 0.3, 0.04, 900, 400, 'bandpass', 2, 0.15);
        sparkle(audio, start + 6.1, 12, 1.4, 0.022);
        padChord(audio, start + 6.2, [293.7, 370, 440], 2.6, 0.016, 'triangle', 2600);
    },
    draw(ctx, scene, time) {
        const W = scene.width;
        const H = scene.height;
        const u = scene.unit;
        const found = 6100;
        const lit = smoothstep(found, found + 700, time);
        ctx.fillStyle = '#2a2420';
        ctx.fillRect(0, 0, W, H);
        // shelf and bottles
        ctx.fillStyle = '#4a3b30';
        ctx.fillRect(W * 0.08, H * 0.3, W * 0.36, 1.2 * u);
        ['#5aa', '#a75', '#7a5', '#99c'].forEach((c, i) => {
            ctx.fillStyle = c;
            ctx.fillRect(W * 0.1 + i * 7 * u, H * 0.3 - 7 * u, 4 * u, 7 * u);
        });
        // bench and drawers
        const top = H * 0.6;
        ctx.fillStyle = '#5a4637';
        ctx.fillRect(W * 0.05, top, W * 0.9, 2 * u);
        const dw = W * 0.15;
        const opens = [2900, 3600, 4300, 5000, 5800];
        for (let i = 0; i < 5; i++) {
            const x = W * 0.12 + i * (dw + W * 0.0125);
            const o = smoothstep(opens[i], opens[i] + 300, time) * (i < 4 ? 1 - smoothstep(opens[i] + 600, opens[i] + 900, time) : 1);
            ctx.fillStyle = '#3d3029';
            ctx.fillRect(x, top + 4 * u, dw, 12 * u);
            ctx.fillStyle = '#6b5544';
            ctx.fillRect(x + 0.4 * u, top + 4.4 * u + o * 6 * u, dw - 0.8 * u, 11 * u);
            ctx.fillStyle = '#c9a66b';
            ctx.fillRect(x + dw / 2 - 2 * u, top + 9 * u + o * 6 * u, 4 * u, 0.8 * u);
            if (o > 0.5 && i < 4) {
                drawText(ctx, 'empty', x + dw / 2, top + 22 * u, 2 * u, '#cdbba3', (o - 0.5) * 2, 500);
            }
            if (i === 4 && o > 0) {
                drawGlow(ctx, x + dw / 2, top + 6 * u, 18 * u, '#7cf2c7', o * (0.7 + 0.2 * Math.sin(time / 150)));
            }
        }
        // the torch beam goes everywhere first
        const path = [[0, W * 0.2, H * 0.2], [900, W * 0.25, H * 0.24], [1600, W * 0.7, H * 0.4], [2300, W * 0.5, H * 0.85],
            [2900, W * 0.12 + dw / 2, top + 10 * u], [3600, W * 0.12 + 1.08 * dw + dw / 2, top + 10 * u], [4300, W * 0.12 + 2.17 * dw + dw / 2, top + 10 * u],
            [5000, W * 0.12 + 3.25 * dw + dw / 2, top + 10 * u], [5800, W * 0.12 + 4.33 * dw + dw / 2, top + 10 * u]];
        let bx = path[0][1];
        let by = path[0][2];
        for (let i = 1; i < path.length; i++) {
            const k = smoothstep(path[i - 1][0], path[i][0], time);
            if (k > 0) {
                bx = path[i - 1][1] + (path[i][1] - path[i - 1][1]) * k;
                by = path[i - 1][2] + (path[i][2] - path[i - 1][2]) * k;
            }
        }
        const dark = ctx.createRadialGradient(bx, by, 0, bx, by, 20 * u);
        dark.addColorStop(0, 'rgba(0,0,0,0)');
        dark.addColorStop(0.75, 'rgba(0,0,0,' + 0.55 * (1 - lit) + ')');
        dark.addColorStop(1, 'rgba(0,0,0,' + 0.93 * (1 - lit) + ')');
        ctx.fillStyle = dark;
        ctx.fillRect(0, 0, W, H);
        const out = 1 - smoothstep(6800, 7300, time);
        [[1200, W * 0.25, H * 0.12], [2000, W * 0.7, H * 0.28], [2600, W * 0.5, H * 0.72]].forEach(([t, x, y]) => {
            drawText(ctx, '?', x, y, 5 * u, '#ffe08a', smoothstep(t - 300, t, time) * (1 - smoothstep(t + 500, t + 900, time)), 800);
        });
        drawText(ctx, 'FOUND IT', W / 2, H * 0.18, 5 * u * easeOutCubic((time - found) / 400), '#7cf2c7', lit * out, 800, 0.5 * u);
        if (time > 6900) {
            ctx.fillStyle = 'rgba(8,14,12,' + smoothstep(6900, 7500, time) * 0.95 + ')';
            ctx.fillRect(0, 0, W, H);
        }
        // and up it comes
        if (time > found) {
            const k = easeOutCubic((time - found - 200) / 1100);
            const ox = path[8][1] + (W / 2 - path[8][1]) * k;
            const oy = top + 6 * u + (H / 2 - top - 6 * u) * k;
            const fa = 1 - smoothstep(7300, 7900, time);
            drawGlow(ctx, ox, oy, 16 * u, '#7cf2c7', 0.9 * fa);
            ctx.globalAlpha = fa;
            ctx.fillStyle = '#d9fff1';
            ctx.beginPath();
            ctx.arc(ox, oy, 2.2 * u, 0, TAU);
            ctx.fill();
            ctx.globalAlpha = 1;
        }
        drawCard(ctx, scene, time, 7300, '#7cf2c7', '#2bb58a');
    }
};
// Df: the reaction gets to 99%, then gets moved to tomorrow
CUTSCENES.Df = {
    z: 0, dur: 8800,
    snd(audio, start) {
        for (let i = 0; i < 14; i++) {
            playTone(audio, 400 + i * 40, start + 0.3 + i * 0.13, 0.05, 0.014, 'square', null, 0.1, 0, 0.003);
        }
        for (let x = 2.4; x < 4.4; x += 0.5) {
            playTone(audio, 1800, start + x, 0.02, 0.015, 'sine', null, 0.1, 0, 0.001);
        }
        playNoise(audio, start + 4.9, 0.25, 0.04, 4000, 1500, 'highpass', 1, 0.2);
        playTone(audio, 392, start + 5.4, 0.45, 0.03, 'triangle', 370, 0.2);
        playTone(audio, 349, start + 5.9, 0.9, 0.03, 'triangle', 311, 0.25);
    },
    draw(ctx, scene, time) {
        const W = scene.width;
        const H = scene.height;
        const u = scene.unit;
        const cx = W / 2;
        const cy = H / 2;
        ctx.fillStyle = '#16191f';
        ctx.fillRect(0, 0, W, H);
        const ui = smoothstep(0, 500, time) * (1 - smoothstep(4000, 4400, time));
        const p = Math.min(0.99, smoothstep(300, 2200, time) * 0.99);
        drawText(ctx, p >= 0.99 ? 'REACTING… ALMOST' : 'REACTING…', cx, cy - 8 * u, 3 * u, '#ffb547', ui, 700, 0.5 * u);
        ctx.globalAlpha = ui;
        ctx.strokeStyle = '#ffb547';
        ctx.lineWidth = 0.4 * u;
        ctx.strokeRect(cx - 25 * u, cy - 2 * u, 50 * u, 4 * u);
        ctx.fillStyle = '#ffb547';
        ctx.fillRect(cx - 25 * u, cy - 2 * u, 50 * u * p, 4 * u);
        ctx.globalAlpha = 1;
        drawText(ctx, Math.floor(p * 100) + '%', cx, cy + 7 * u, 2.6 * u, '#ffd9a0', ui, 600);
        if (p >= 0.99 && ui > 0) {
            const a = time / 120;
            for (let i = 0; i < 8; i++) {
                ctx.fillStyle = 'rgba(255,181,71,' + ((i / 8) * ui) + ')';
                ctx.beginPath();
                ctx.arc(cx + 30 * u + Math.cos(a + i * 0.785) * 2 * u, cy + Math.sin(a + i * 0.785) * 2 * u, 0.5 * u, 0, TAU);
                ctx.fill();
            }
        }
        // the calendar
        const ca = smoothstep(4200, 4600, time) * (1 - smoothstep(6400, 6900, time));
        if (ca > 0) {
            const flip = smoothstep(4900, 5300, time);
            const day = (sheet, label, n) => {
                ctx.fillStyle = '#f4efe6';
                ctx.fillRect(sheet[0], sheet[1], 22 * u, 24 * u);
                ctx.fillStyle = '#d14d4d';
                ctx.fillRect(sheet[0], sheet[1], 22 * u, 6 * u);
                drawText(ctx, label, sheet[0] + 11 * u, sheet[1] + 3 * u, 2.4 * u, '#fff', ca, 700, 0.3 * u);
                drawText(ctx, n, sheet[0] + 11 * u, sheet[1] + 15 * u, 10 * u, '#2a2a2a', ca, 800);
            };
            ctx.globalAlpha = ca;
            day([cx - 11 * u, cy - 14 * u], 'TOMORROW', '13');
            // today's page tears away
            if (flip < 1) {
                ctx.save();
                ctx.translate(cx, cy - 14 * u);
                ctx.rotate(-flip * 0.5);
                ctx.translate(-flip * 30 * u, -flip * 20 * u);
                ctx.globalAlpha = ca * (1 - flip);
                day([-11 * u, 0], 'TODAY', '12');
                ctx.restore();
            }
            ctx.globalAlpha = 1;
            drawText(ctx, 'Reaction rescheduled', cx, cy + 16 * u, 3 * u, '#ffb547', ca * smoothstep(5300, 5600, time), 700, 0.3 * u);
        }
        drawCard(ctx, scene, time, 7000, '#ffb547', '#c46a1a');
    }
};
// Cz: a coffee lands on the periodic table and the neighbours get the jitters
CUTSCENES.Cz = {
    z: 0, dur: 8600,
    snd(audio, start) {
        playTone(audio, 2100, start + 1.6, 0.15, 0.03, 'sine', null, 0.3, 0, 0.002);
        playNoise(audio, start + 1.6, 0.3, 0.04, 2500, 800, 'bandpass', 1, 0.2);
        riser(audio, start + 1.8, 3.6, 0.02, 60, 240);
        for (let x = 2; x < 5.4; x += 0.3 - (x - 2) * 0.06) {
            playNoise(audio, start + x, 0.06, 0.01 + (x - 2) * 0.008, 3000, 1500, 'bandpass', 3, 0.05, 0.002);
        }
        playTone(audio, 1318.5, start + 5.6, 0.6, 0.02, 'sine', null, 0.4);
    },
    draw(ctx, scene, time) {
        const W = scene.width;
        const H = scene.height;
        const u = scene.unit;
        const cx = W / 2;
        const cy = H / 2;
        const st = scene.state;
        if (!st.r) {
            st.r = seededRandom(48);
        }
        ctx.fillStyle = '#1c130e';
        ctx.fillRect(0, 0, W, H);
        const land = 1600;
        const stop = 5600;
        const fade = 1 - smoothstep(6200, 6700, time);
        // the table
        const s = Math.min(W / 21, H / 11);
        const ox = cx - 9 * s;
        const oy = cy - 3.5 * s;
        const spread = smoothstep(land, 5200, time) * 14 * s;
        const buzz = time > land && time < stop ? 1 : 0;
        const calm = calmFx ? 0.35 : 1;
        Object.keys(tableLayout).forEach(sym => {
            const [r, c] = tableLayout[sym];
            if (r > 7) {
                return;
            }
            const x = ox + (c - 1) * s;
            const y = oy + (r - 1) * s;
            const dist = Math.hypot(x - cx, y - cy);
            const j = buzz * clamp(1 - dist / (spread + 0.01)) * 0.18 * s * calm;
            const jx = (st.r() - 0.5) * 2 * j;
            const jy = (st.r() - 0.5) * 2 * j;
            ctx.globalAlpha = fade;
            ctx.fillStyle = j > 0.02 * s ? '#a8683a' : '#4a3326';
            ctx.fillRect(x + jx + 0.06 * s, y + jy + 0.06 * s, 0.88 * s, 0.88 * s);
            ctx.globalAlpha = 1;
            drawText(ctx, sym, x + jx + 0.5 * s, y + jy + 0.52 * s, 0.38 * s, '#f1d9bf', fade * 0.8, 600);
        });
        // the cup drops in
        const fall = smoothstep(800, land, time);
        const cupY = -10 * u + (cy - 2 * u + 10 * u) * fall * fall;
        const shake = buzz * 0.5 * u * calm * smoothstep(land, 5200, time);
        const kx = cx + (st.r() - 0.5) * shake;
        ctx.globalAlpha = fade;
        ctx.fillStyle = '#f4efe6';
        ctx.beginPath();
        ctx.moveTo(kx - 4 * u, cupY - 4 * u);
        ctx.lineTo(kx + 4 * u, cupY - 4 * u);
        ctx.lineTo(kx + 3 * u, cupY + 3 * u);
        ctx.lineTo(kx - 3 * u, cupY + 3 * u);
        ctx.fill();
        ctx.strokeStyle = '#f4efe6';
        ctx.lineWidth = 0.7 * u;
        ctx.beginPath();
        ctx.arc(kx + 4.4 * u, cupY - 0.5 * u, 1.6 * u, -1.3, 1.3);
        ctx.stroke();
        ctx.fillStyle = '#5b3418';
        ctx.fillRect(kx - 3.6 * u, cupY - 4 * u, 7.2 * u, 0.9 * u);
        ctx.globalAlpha = 1;
        // steam
        if (time > land) {
            for (let i = 0; i < 3; i++) {
                const p = (time / 1400 + i / 3) % 1;
                drawGlow(ctx, kx + (i - 1) * 2 * u + Math.sin(p * 6 + i) * u, cupY - 6 * u - p * 10 * u, 2.4 * u, '#ffffff', 0.25 * Math.sin(p * Math.PI) * fade);
            }
        }
        drawText(ctx, 'JITTERY', cx, H - 6 * u, 3.2 * u, '#e0a56a', smoothstep(3500, 4000, time) * (1 - smoothstep(stop, stop + 300, time)), 800, 0.8 * u);
        drawCard(ctx, scene, time, 6700, '#e0a56a', '#7a4a24');
    }
};
// Mb: flickers in and out of a box until something looks at it
CUTSCENES.Mb = {
    z: 0, dur: 8400,
    snd(audio, start) {
        for (let i = 0; i < 20; i++) {
            playTone(audio, i % 2 ? 660 : 440, start + 0.8 + i * 0.14, 0.1, 0.012, 'sine', null, 0.3);
        }
        playNoise(audio, start + 3.7, 0.3, 0.02, 500, 2000, 'bandpass', 2, 0.2);
        boom(audio, start + 4.3, 0.04, 0.6);
        sparkle(audio, start + 4.35, 12, 1.4, 0.02);
        padChord(audio, start + 4.4, [277.2, 349.2, 415.3], 2.6, 0.016, 'triangle', 2400);
    },
    draw(ctx, scene, time) {
        const W = scene.width;
        const H = scene.height;
        const u = scene.unit;
        const cx = W / 2;
        const cy = H / 2 + 3 * u;
        const st = scene.state;
        if (!st.r) {
            st.r = seededRandom(5);
            st.on = 0;
            st.next = 0;
        }
        const look = 4300;
        const seen = time >= look;
        ctx.fillStyle = '#120a22';
        ctx.fillRect(0, 0, W, H);
        const fade = 1 - smoothstep(6000, 6500, time);
        // in, out, in, out
        if (!seen && time > st.next) {
            st.on = st.r() < 0.5 ? 0 : 1;
            st.next = time + 90 + st.r() * 220;
        }
        const here = seen ? 1 : time > 800 ? st.on : 0;
        drawGlow(ctx, cx, cy, (seen ? 20 : 12) * u, '#b48cff', here * (seen ? 0.9 - 0.4 * smoothstep(look, look + 1200, time) : 0.7) * fade);
        if (here) {
            ctx.globalAlpha = fade * (calmFx && !seen ? 0.6 : 1);
            ctx.fillStyle = '#e6d8ff';
            ctx.beginPath();
            ctx.arc(cx, cy, 2.6 * u, 0, TAU);
            ctx.fill();
            ctx.globalAlpha = 1;
        }
        // the box, whose sides drop once it's been seen
        const open = smoothstep(look, look + 700, time);
        ctx.strokeStyle = 'rgba(201,167,255,' + 0.8 * fade + ')';
        ctx.lineWidth = 0.4 * u;
        const b = 9 * u;
        ctx.strokeRect(cx - b, cy + b - 0.2 * u, 2 * b, 0.4 * u);
        [[-1, 0], [1, 0]].forEach(([s]) => {
            ctx.save();
            ctx.translate(cx + s * b, cy + b);
            ctx.rotate(s * open * 1.4);
            ctx.strokeRect(-0.2 * u, -2 * b, 0.4 * u, 2 * b);
            ctx.restore();
        });
        ctx.save();
        ctx.translate(cx, cy - b - open * 8 * u);
        ctx.rotate(open * 0.3);
        ctx.globalAlpha = 1 - open;
        ctx.strokeRect(-b, -0.2 * u, 2 * b, 0.4 * u);
        ctx.restore();
        // the eye
        const ea = smoothstep(3500, 3800, time) * (1 - smoothstep(5200, 5600, time));
        if (ea > 0) {
            const lid = smoothstep(3700, 4200, time);
            const ex = cx;
            const ey = cy - 22 * u;
            ctx.globalAlpha = ea;
            ctx.fillStyle = '#f4efe6';
            ctx.beginPath();
            ctx.ellipse(ex, ey, 7 * u, 3.5 * u * lid + 0.1, 0, 0, TAU);
            ctx.fill();
            ctx.fillStyle = '#4a2d8a';
            ctx.beginPath();
            ctx.arc(ex, ey + (seen ? 0.8 * u : 0), 2.2 * u * lid, 0, TAU);
            ctx.fill();
            ctx.globalAlpha = 1;
        }
        drawText(ctx, 'EXISTS: ' + (seen ? 'YES' : here ? 'MAYBE' : 'MAYBE NOT'), cx, H - 6 * u, 2.6 * u, '#c9a7ff', smoothstep(800, 1200, time) * (1 - smoothstep(5600, 6000, time)), 700, 0.5 * u);
        drawCard(ctx, scene, time, 6400, '#c9a7ff', '#6b3fd1');
    }
};
// Dj: the same discovery plays, rewinds, plays again, rewinds...
CUTSCENES.Dj = {
    z: 0, dur: 9000,
    snd(audio, start) {
        [0, 2.4, 4.8].forEach((x, i) => {
            playNoise(audio, start + x + 0.2, 0.8, 0.02, 400, 2400, 'bandpass', 1, 0.2, 0.3);
            playTone(audio, 1046.5 - i * 60, start + x + 1, 0.5, 0.025, 'sine', null, 0.4);
        });
        [1.8, 4.2].forEach(x => {
            riser(audio, start + x, 0.55, 0.02, 2400, 300);
            playNoise(audio, start + x, 0.55, 0.025, 6000, 3000, 'highpass', 1, 0.05);
        });
        padChord(audio, start + 7, [311.1, 392, 466.2], 2, 0.016, 'triangle', 2400);
    },
    draw(ctx, scene, time) {
        const W = scene.width;
        const H = scene.height;
        const u = scene.unit;
        const cx = W / 2;
        const cy = H / 2;
        const st = scene.state;
        if (!st.r) {
            st.r = seededRandom(19);
        }
        const takes = [[0, 1800, 'A new discovery!'], [2400, 4200, 'A new discovery?'], [4800, 6600, 'A new discovery…?']];
        const rewinds = [[1800, 2400], [4200, 4800]];
        ctx.fillStyle = '#140a1c';
        ctx.fillRect(0, 0, W, H);
        let t = -1;
        let take = 0;
        takes.forEach(([a, b], i) => {
            if (time >= a && time < b) {
                t = time - a;
                take = i;
            }
        });
        rewinds.forEach(([a, b], i) => {
            if (time >= a && time < b) {
                // running it backwards
                t = 1800 * (1 - (time - a) / (b - a));
                take = i;
            }
        });
        const rw = rewinds.some(([a, b]) => time >= a && time < b);
        if (t >= 0) {
            const k = smoothstep(0, 900, t);
            const x = cx - 30 * u * (1 - k);
            drawGlow(ctx, x, cy, (8 + 10 * smoothstep(900, 1100, t)) * u, '#ff9ce6', 0.7);
            ctx.fillStyle = '#ffe3f7';
            ctx.beginPath();
            ctx.arc(x, cy, 2.4 * u, 0, TAU);
            ctx.fill();
            drawText(ctx, takes[take][2], cx, cy + 12 * u, 3.4 * u, '#ff9ce6', smoothstep(1000, 1300, t), 800, 0.3 * u);
            if (take === 2) {
                drawText(ctx, "Haven't we done this before?", cx, cy + 18 * u, 2.2 * u, '#e6c9f2', smoothstep(1300, 1600, t), 500);
            }
        }
        if (rw) {
            const n = calmFx ? 0.35 : 1;
            for (let i = 0; i < 14; i++) {
                const y = st.r() * H;
                ctx.fillStyle = 'rgba(255,255,255,' + 0.08 * n + ')';
                ctx.fillRect(0, y, W, st.r() * 1.2 * u);
            }
            ctx.fillStyle = 'rgba(255,255,255,' + 0.12 * n + ')';
            ctx.fillRect(0, (time * 0.8) % H, W, 3 * u);
            drawText(ctx, '◀◀ REWIND', 12 * u, 6 * u, 2.6 * u, '#ffffff', 0.85, 700, 0.3 * u);
        }
        const out = smoothstep(6600, 7000, time);
        if (out > 0) {
            ctx.fillStyle = 'rgba(20,10,28,' + out + ')';
            ctx.fillRect(0, 0, W, H);
        }
        drawCard(ctx, scene, time, 7000, '#ff9ce6', '#8a3bd1');
    }
};
const STORE_LIMIT = 5 * 1024 * 1024;
function storageBytes() {
    let n = 0;
    try {
        for (let i = 0; i < localStorage.length; i++) {
            const k = localStorage.key(i);
            n += (k.length + (localStorage.getItem(k) || '').length) * 2;
        }
    } catch (e) { }
    return n;
}
const fmtBytes = n => n < 1024 * 1024 ? Math.max(1, Math.round(n / 1024)) + ' KB' : (n / 1048576).toFixed(1) + ' MB';
function planClear(minScore) {
    const keep = new Set();
    const ach = new Set(ACHIEVEMENTS.map(a => normalizeFormula(a.formula)));
    collection.forEach(c => {
        if (c.score >= minScore || c.elements.length === 1 || ach.has(c.formula)) {
            keep.add(c);
        }
    });
    groupedCollection().slice(0, 10).forEach(g => keep.add(collection.find(c => c.formula === g.formula)));
    scoreRanked().slice(0, 10).forEach(g => keep.add(collection.find(c => c.formula === g.formula)));
    const avail = c => (c.count || 1) - (c.spent || 0);
    // compounds each element's unfilled bonds still need
    const need = {};
    net().nodes.forEach(n => {
        if (n.req && n.req.t === 'has' && !netFilled(n.id)) {
            need[n.req.k] = (need[n.req.k] || 0) + n.req.n;
        }
    });
    Object.keys(need).forEach(k => {
        const list = collection.filter(c => c.elements.length > 1 && c.elements.some(e => e[0] === k) && avail(c) > 0);
        let have = list.filter(c => keep.has(c)).reduce((s, c) => s + avail(c), 0);
        list.filter(c => !keep.has(c)).sort((a, b) => avail(b) - avail(a)).forEach(c => {
            if (have < need[k]) {
                keep.add(c);
                have += avail(c);
            }
        });
    });
    // every found element stays found
    const covered = new Set();
    keep.forEach(c => c && c.elements.forEach(e => covered.add(e[0])));
    discoveredSymbols().forEach(s => {
        if (!covered.has(s)) {
            const best = collection.filter(c => c.elements.some(e => e[0] === s)).sort((a, b) => b.score - a.score)[0];
            if (best) {
                keep.add(best);
                best.elements.forEach(e => covered.add(e[0]));
            }
        }
    });
    const remove = collection.filter(c => !keep.has(c));
    const bytes = remove.reduce((s, c) => s + JSON.stringify(c.spent > 0 ? [c.formula, c.count || 1, c.spent] : [c.formula, c.count || 1]).length + 1, 0) * 2;
    return { remove, rolls: remove.reduce((s, c) => s + (c.count || 1), 0), bytes };
}
function renderStorage() {
    const used = storageBytes();
    const pct = Math.min(100, used / STORE_LIMIT * 100);
    $('storeUse').textContent = 'Your save uses ' + fmtBytes(used) + ' of the roughly 5 MB this browser allows' + (pct >= 80 ? '. It is nearly full.' : '.');
    $('storeBar').style.width = pct.toFixed(1) + '%';
    $('storeBar').classList.toggle('full', pct >= 80);
    $('clearConfirm').hidden = true;
    $('clearBtn').hidden = false;
}
let clearPending = null;
$('clearBtn').onclick = () => {
    const min = Math.floor(+$('clearMin').value);
    if (!(min > 0)) {
        admMsg('clearMsg', 'Type the minimum score to keep, for example 10,000.', true);
        return;
    }
    const plan = planClear(min);
    if (!plan.remove.length) {
        admMsg('clearMsg', 'Nothing to clear: every find below that score is still needed.', false);
        return;
    }
    clearPending = plan;
    admMsg('clearMsg', 'This removes ' + formatNumber(plan.remove.length) + ' of your ' + formatNumber(collection.length) + ' finds and frees about ' + fmtBytes(plan.bytes) +
        '. Your roll total, elements found, achievements and bonds stay the same. This can\'t be undone.', false);
    $('clearBtn').hidden = true;
    $('clearConfirm').hidden = false;
    $('clearYes').textContent = 'Remove ' + formatNumber(plan.remove.length) + ' finds';
};
$('clearNo').onclick = () => {
    clearPending = null;
    admMsg('clearMsg', '');
    renderStorage();
};
$('clearYes').onclick = () => {
    if (!clearPending) {
        return;
    }
    const gone = new Set(clearPending.remove);
    clearCleared.rolls += clearPending.rolls;
    clearCleared.formulas += gone.size;
    collection = collection.filter(c => !gone.has(c));
    try {
        localStorage.setItem('elementalCleared', JSON.stringify(clearCleared));
    } catch (e) { }
    save.warned = false;
    save();
    location.reload();
};
// Cutscene and effect viewer (Settings): replay any cutscene or rarity effect you've seen
let seenData = null;
function seenLoad() {
    if (seenData) {
        return seenData;
    }
    try {
        seenData = JSON.parse(localStorage.getItem('elementalSeen') || 'null');
    } catch (e) {
        seenData = null;
    }
    if (!seenData || typeof seenData !== 'object') {
        const found = discoveredSymbols();
        const tiers = new Set();
        collection.forEach(c => {
            const t = getRarityTier(c.score);
            if (t > 0) {
                tiers.add(t);
            }
        });
        seenData = { cut: Object.keys(CUTSCENES).filter(s => found.has(s)), fx: [...tiers].sort((a, b) => a - b), dark: [] };
        seenSave();
    }
    ['cut', 'fx', 'dark'].forEach(k => seenData[k] = Array.isArray(seenData[k]) ? seenData[k] : []);
    return seenData;
}
function seenSave() {
    try {
        localStorage.setItem('elementalSeen', JSON.stringify(seenData));
    } catch (e) { }
}
function seenAdd(kind, v) {
    const s = seenLoad();
    if (!s[kind].includes(v)) {
        s[kind].push(v);
        seenSave();
    }
}
const VIEW_ORDER = (jokes = false) => Object.keys(CUTSCENES).filter(s => isJoke(s) === jokes).sort((a, b) => CUTSCENES[b].z - CUTSCENES[a].z === 0 ? 0 : elementBySymbol[b][2] - elementBySymbol[a][2]);
function renderViewer() {
    const s = seenLoad();
    const cuts = $('vwCuts');
    cuts.innerHTML = VIEW_ORDER().map(sym => s.cut.includes(sym) ?
        '<button class="vw-tile" data-cut="' + sym + '"><b>' + sym + '</b><span>' + esc(elementBySymbol[sym][1]) + '</span></button>' :
        '<button class="vw-tile locked" disabled><b>?</b><span>Not seen yet</span></button>').join('');
    $('vwJokeWrap').hidden = !jokesOn();
    $('vwJokes').innerHTML = VIEW_ORDER(true).map(sym => s.cut.includes(sym) ?
        '<button class="vw-tile" data-cut="' + sym + '"><b>' + sym + '</b><span>' + esc(elementBySymbol[sym][1]) + '</span></button>' :
        '<button class="vw-tile locked" disabled><b>?</b><span>Not seen yet</span></button>').join('');
    const tiers = Math.max(9, tierTop());
    $('vwFx').innerHTML = TIER_SCORES.slice(0, tiers).map((_, i) => i + 1).map(t => s.fx.includes(t) ?
        '<button class="vw-tile" data-fx="' + t + '" style="--tc:' + RARITY_FX[t].c + '"><b>' + t + '</b><span>Tier ' + t + '</span></button>' :
        '<button class="vw-tile locked" disabled><b>?</b><span>Tier ' + t + '</span></button>').join('');
    const dark = s.dark.filter(t => RARITY_DARK[t]).sort((a, b) => a - b);
    $('vwDarkWrap').hidden = !dark.length;
    $('vwDark').innerHTML = dark.map(t => '<button class="vw-tile dark" data-dark="' + t + '" style="--tc:' + RARITY_DARK[t].c + '"><b>' + t + '</b><span>Secret tier ' + t + '</span></button>').join('');
    $('vwCount').textContent = s.cut.filter(x => !isJoke(x)).length + ' of ' + VIEW_ORDER().length + ' cutscenes and ' + s.fx.length + ' of ' + tiers + ' effects seen.';
}
async function viewerPlay(btn) {
    if (rolling) {
        return;
    }
    const s = seenLoad();
    if (btn.dataset.cut && s.cut.includes(btn.dataset.cut)) {
        const e = elementBySymbol[btn.dataset.cut];
        const els = [e];
        go('game');
        await doRoll([{ elements: els, formula: e[0], name: e[1], log: exactRarity(els, 0), rarity: rarityText(exactRarity(els, 0)), score: rollScore(els) }], { replay: true });
        return;
    }
    const t = +(btn.dataset.fx || btn.dataset.dark);
    const dark = !!btn.dataset.dark;
    if (!t || !(dark ? s.dark : s.fx).includes(t)) {
        return;
    }
    go('game');
    setTimeout(() => {
        playResultChime(TIER_SCORES[t - 1], dark);
        playRarityFx(t, dark);
    }, 250);
}
['vwCuts', 'vwJokes', 'vwFx', 'vwDark'].forEach(id => $(id).addEventListener('click', e => {
    const b = e.target.closest('button[data-cut], button[data-fx], button[data-dark]');
    if (b) {
        viewerPlay(b);
    }
}));
if (/[?&]app=play\b/.test(location.search) || /; wv\)/.test(navigator.userAgent)) {
    document.querySelectorAll('.donate-only').forEach(e => e.remove());
}
// Accounts and cloud saves (Supabase)
const CLOUD = {
    enabled: true,
    url: 'https://svfscvtskwuaygjgszog.supabase.co',
    key: 'sb_publishable_TF1DqFy8EPLwXOuZjPv_CQ_jgk2_oYf',
    lib: 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.112.4/dist/umd/supabase.js'
};
const CLOUD_KEYS = ['elementalCollection', 'elementalCleared', 'elementalSeen', 'elementalAchievements', 'elementalQuarks', 'elementalHistory', 'elementalNetwork', 'elementalShop', 'elementalCatInv', 'elementalCatActive', 'elementalCatFlags', 'elementalIons', 'elementalCosmetics'];
const CLOUD_EVERY = 45000;
let sb = null;
let cloudUser = null;
let cloudName = null;
let cloudState = 'loading'; // loading | offline | signedout | syncing | synced | error
let cloudBusy = false;
let cloudLastSync = 0;
let cloudError = '';
let cloudProfileReady = false;
const cloudGet = k => {
    try {
        return localStorage.getItem(k);
    } catch (e) {
        return null;
    }
};
const cloudSet = (k, v) => {
    try {
        if (v == null) {
            localStorage.removeItem(k);
        } else {
            localStorage.setItem(k, v);
        }
    } catch (e) { }
};
function cloudSnapshot() {
    const d = {};
    CLOUD_KEYS.forEach(k => {
        const v = cloudGet(k);
        if (v != null) {
            d[k] = v;
        }
    });
    return d;
}
function cloudHash(d) {
    const s = CLOUD_KEYS.map(k => k + '=' + (d[k] == null ? '' : d[k])).join('\n');
    let h = 2166136261;
    for (let i = 0; i < s.length; i++) {
        h ^= s.charCodeAt(i);
        h = Math.imul(h, 16777619);
    }
    return (h >>> 0).toString(36) + ':' + s.length;
}
function cloudSummary(d) {
    let col = [];
    let ach = [];
    try {
        col = unpackCollection(JSON.parse(d.elementalCollection || '[]'));
    } catch (e) { }
    try {
        ach = JSON.parse(d.elementalAchievements || '[]');
    } catch (e) { }
    const syms = new Set();
    let rolls = 0;
    try {
        rolls = JSON.parse(d.elementalCleared || '{}').rolls || 0;
    } catch (e) { }
    col.forEach(c => {
        rolls += c.count || 1;
        (c.elements || []).forEach(e => syms.add(e[0]));
    });
    return { rolls, found: syms.size, ach: ach.length, quarks: Math.floor(parseFloat(d.elementalQuarks) || 0) };
}
function cloudLoadLib() {
    return new Promise((resolve, reject) => {
        if (window.supabase && window.supabase.createClient) {
            resolve();
            return;
        }
        const s = document.createElement('script');
        s.src = CLOUD.lib;
        s.async = true;
        s.onload = () => window.supabase ? resolve() : reject(new Error('lib'));
        s.onerror = () => reject(new Error('lib'));
        document.head.appendChild(s);
    });
}
// most of the name before the @ is starred out
function maskEmail(e) {
    const at = e.indexOf('@');
    if (at < 1) {
        return e;
    }
    const keep = at > 3 ? 2 : 1;
    return e.slice(0, keep) + '*'.repeat(Math.max(3, at - keep - 1)) + (at > 3 ? e[at - 1] : '') + e.slice(at);
}
async function cloudInit() {
    if (!CLOUD.enabled) {
        cloudState = 'disabled';
        renderAccount();
        return;
    }
    cloudState = 'loading';
    renderAccount();
    try {
        await cloudLoadLib();
        sb = window.supabase.createClient(CLOUD.url, CLOUD.key, {
            auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true, flowType: 'pkce' }
        });
    } catch (e) {
        cloudState = 'offline';
        renderAccount();
        return;
    }
    // Supabase reports the starting session first, then any sign-in or sign-out
    sb.auth.onAuthStateChange((event, session) => {
        setTimeout(() => cloudOnSession(session), 0);
    });
    globalLoad();
    rtStart();
}
async function cloudOnSession(session) {
    const user = session && session.user;
    if (!user) {
        cloudUser = null;
        cloudName = null;
        cloudState = 'signedout';
        renderAccount();
        renderGlobal();
        adminShow(false);
        return;
    }
    if (cloudUser && cloudUser.id === user.id) {
        return;
    }
    cloudUser = user;
    if (/[?&]code=/.test(location.search)) {
        history.replaceState(null, '', location.pathname + location.hash);
    }
    await cloudSync();
    await cloudLoadProfile();
    if (cloudName) {
        cloudAfterProfile();
    }
    renderGlobal();
}
function cloudFail(error) {
    cloudBusy = false;
    cloudState = 'error';
    cloudError = navigator.onLine === false ? 'You are offline' : 'Could not reach the server';
    renderAccount();
    if (error) {
        console.warn('[cloud]', error.message || error);
    }
}
function cloudDone(at, hash) {
    cloudSet('elementalCloudUser', cloudUser.id);
    cloudSet('elementalCloudAt', at);
    cloudSet('elementalCloudHash', hash);
    cloudBusy = false;
    cloudState = 'synced';
    cloudLastSync = Date.now();
    renderAccount();
}
// Compares this device with the cloud and settles which save wins.
async function cloudSync() {
    if (!sb || !cloudUser || cloudBusy) {
        return;
    }
    cloudBusy = true;
    cloudState = 'syncing';
    renderAccount();
    const { data: head, error } = await sb.from('saves').select('updated_at').eq('user_id', cloudUser.id).maybeSingle();
    if (error) {
        cloudFail(error);
        return;
    }
    const local = cloudSnapshot();
    const hash = cloudHash(local);
    const linked = cloudGet('elementalCloudUser') === cloudUser.id;
    const localChanged = !linked || hash !== cloudGet('elementalCloudHash');
    if (!head) {
        // first time on this account: this device's save becomes the cloud save
        cloudBusy = false;
        await cloudUpload(true);
        return;
    }
    const cloudChanged = !linked || head.updated_at !== cloudGet('elementalCloudAt');
    const fresh = cloudGet('elementalCloudFresh') === '1';
    cloudSet('elementalCloudFresh', null);
    if (!cloudChanged) {
        cloudBusy = false;
        // just restarted on a cloud save: the game tidying its storage on load isn't new progress
        if (localChanged && !fresh) {
            await cloudUpload(false);
        } else {
            cloudDone(head.updated_at, hash);
        }
        return;
    }
    const { data: row, error: err2 } = await sb.from('saves').select('data, updated_at').eq('user_id', cloudUser.id).maybeSingle();
    if (err2 || !row) {
        cloudFail(err2);
        return;
    }
    if (!localChanged || cloudSummary(local).rolls === 0) {
        cloudApply(row);
        return;
    }
    cloudBusy = false;
    cloudState = 'choose';
    renderAccount();
    cloudChoose(local, row);
}
// Sends this device's progress up
async function cloudUpload(force) {
    if (!sb || !cloudUser || cloudBusy) {
        return;
    }
    cloudBusy = true;
    cloudState = 'syncing';
    renderAccount();
    const d = cloudSnapshot();
    const hash = cloudHash(d);
    const at = cloudGet('elementalCloudAt');
    const linked = cloudGet('elementalCloudUser') === cloudUser.id;
    const q = !force && linked && at ?
        sb.from('saves').update({ data: d }).eq('user_id', cloudUser.id).eq('updated_at', at).select('updated_at') :
        sb.from('saves').upsert({ user_id: cloudUser.id, data: d }).select('updated_at');
    const { data, error } = await q;
    if (error) {
        cloudFail(error);
        return;
    }
    if (!data || !data.length) {
        // another device saved since this one last synced
        cloudBusy = false;
        await cloudSync();
        return;
    }
    cloudDone(data[0].updated_at, hash);
}
// Replaces this device's progress with the cloud save and restarts the game on it.
function cloudApply(row) {
    try {
        localStorage.setItem('cloudReplacedBackup', JSON.stringify(cloudSnapshot()));
    } catch (e) { }
    CLOUD_KEYS.forEach(k => cloudSet(k, row.data && row.data[k] != null ? row.data[k] : null));
    cloudSet('elementalCloudUser', cloudUser.id);
    cloudSet('elementalCloudAt', row.updated_at);
    cloudSet('elementalCloudHash', cloudHash(cloudSnapshot()));
    cloudSet('elementalCloudFresh', '1');
    location.reload();
}
// Periodic save: only when something changed since the last sync.
function cloudTick() {
    if (!sb || !cloudUser || cloudBusy || cloudState === 'choose') {
        return;
    }
    if (cloudHash(cloudSnapshot()) !== cloudGet('elementalCloudHash') || cloudState === 'error') {
        return cloudUpload(false);
    }
}
setInterval(cloudTick, CLOUD_EVERY);
document.addEventListener('visibilitychange', () => {
    if (!cloudUser) {
        return;
    }
    if (document.visibilityState === 'hidden') {
        cloudTick();
    } else if (!cloudBusy && cloudState !== 'choose') {
        // back on this device: pick up anything played elsewhere
        cloudSync();
    }
});
async function cloudLoadProfile() {
    if (!sb || !cloudUser) {
        return;
    }
    const { data } = await sb.from('profiles').select('display_name').eq('id', cloudUser.id).maybeSingle();
    cloudName = data && data.display_name || null;
    cloudProfileReady = true;
    renderAccount();
    if (!cloudName && cloudState !== 'choose') {
        openNameDialog(true);
    }
}
async function cloudSignIn() {
    if (!sb) {
        return;
    }
    const { error } = await sb.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: location.origin + location.pathname } });
    if (error) {
        cloudFail(error);
    }
}
async function cloudSignOut() {
    if (!sb) {
        return;
    }
    await cloudTick();
    await sb.auth.signOut();
}
// dialogs (name choice and save conflict)
function openDialog(html) {
    closeDialog();
    const wrap = document.createElement('div');
    wrap.className = 'dlg-wrap';
    wrap.id = 'dlg';
    wrap.innerHTML = '<div class="dlg" role="dialog" aria-modal="true">' + html + '</div>';
    document.body.appendChild(wrap);
    return wrap;
}
function closeDialog() {
    const d = $('dlg');
    if (d) {
        d.remove();
    }
}
const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
function openNameDialog(first) {
    const w = openDialog('<h2>' + (first ? 'Choose a display name' : 'Change your name') + '</h2>' +
        '<p>This is the name other players see on the global leaderboard and in announcements.</p>' +
        '<input id="nameInput" maxlength="16" autocomplete="off" autocapitalize="off" spellcheck="false" value="' + esc(cloudName || '') + '">' +
        '<p class="dlg-note" id="nameNote">3 to 16 letters, numbers or underscores.</p>' +
        '<div class="btn-row"><button class="primary" id="nameSave">Save name</button><button class="ghost" id="nameCancel">' + (first ? 'Later' : 'Cancel') + '</button></div>');
    const input = w.querySelector('#nameInput');
    const note = w.querySelector('#nameNote');
    input.focus();
    const save = async () => {
        const n = input.value.trim();
        if (!/^[A-Za-z0-9_]{3,16}$/.test(n)) {
            note.textContent = 'Use 3 to 16 letters, numbers or underscores, with no spaces.';
            note.classList.add('bad');
            return;
        }
        note.textContent = 'Saving…';
        note.classList.remove('bad');
        const { data, error } = await sb.rpc('set_display_name', { new_name: n });
        const msg = {
            ok: '', invalid: 'Use 3 to 16 letters, numbers or underscores, with no spaces.', blocked: "That name isn't allowed. Try another.",
            taken: 'That name is taken. Try another.', signed_out: 'You have been signed out. Sign in again to choose a name.'
        };
        if (error || data !== 'ok') {
            note.textContent = error ? 'Could not reach the server. Try again in a moment.' : (msg[data] || 'Something went wrong. Try again.');
            note.classList.add('bad');
            return;
        }
        cloudName = n;
        closeDialog();
        renderAccount();
        cloudAfterProfile();
    };
    w.querySelector('#nameSave').onclick = save;
    input.onkeydown = e => {
        if (e.key === 'Enter') {
            save();
        }
    };
    w.querySelector('#nameCancel').onclick = () => {
        closeDialog();
        renderAccount();
    };
}
function cloudChoose(local, row) {
    const a = cloudSummary(local);
    const b = cloudSummary(row.data || {});
    const when = new Date(row.updated_at);
    const card = (title, s, sub, id) => '<div class="dlg-save"><h3>' + title + '</h3><p class="dlg-note">' + sub + '</p>' +
        '<dl><dt>Elements found</dt><dd>' + s.found + ' / 118</dd><dt>Rolls</dt><dd>' + formatNumber(s.rolls) + '</dd>' +
        '<dt>Achievements</dt><dd>' + s.ach + '</dd><dt>Quarks</dt><dd>' + formatNumber(s.quarks) + '</dd></dl>' +
        '<button class="ghost" id="' + id + '">Keep this one</button></div>';
    const w = openDialog('<h2>Two different saves</h2>' +
        '<p>This device and your account both have progress. Choose which one to keep. The other is replaced everywhere.</p>' +
        '<div class="dlg-saves">' + card('This device', a, 'Saved here', 'keepLocal') +
        card('Your account', b, 'Saved ' + when.toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' }), 'keepCloud') + '</div>');
    w.querySelector('#keepLocal').onclick = () => {
        closeDialog();
        cloudUpload(true).then(() => cloudName || cloudLoadProfile());
    };
    w.querySelector('#keepCloud').onclick = () => {
        closeDialog();
        cloudApply(row);
    };
}
// the Account section in Settings
function cloudAgo() {
    const s = Math.round((Date.now() - cloudLastSync) / 1000);
    return s < 60 ? 'just now' : s < 3600 ? Math.round(s / 60) + ' min ago' : 'over an hour ago';
}
function renderAccount() {
    const box = $('accountBody');
    if (!box) {
        return;
    }
    const why = '<p>Sign in to keep your progress in sync across your devices and to qualify for the global leaderboard. ' +
        'You can always play without signing in; your progress is saved on this device. <a href="privacy.html">Privacy</a></p>';
    let html;
    if (cloudState === 'disabled') {
        html = '<p>Accounts are switched off in this copy of the game.</p>';
    } else if (cloudState === 'loading') {
        html = why + '<p class="acct-status">Checking your account…</p>';
    } else if (cloudState === 'offline') {
        html = '<p>Accounts aren\'t available right now, so your progress is being saved on this device as usual.</p>' +
            '<div class="btn-row"><button class="ghost" id="acctRetry">Try again</button></div>';
    } else if (!cloudUser) {
        html = why + '<div class="btn-row"><button class="ghost" id="acctIn">Sign in with Google</button></div>';
    } else {
        const status = cloudState === 'syncing' ? 'Syncing…' : cloudState === 'choose' ? 'Waiting for you to choose a save' :
            cloudState === 'error' ? cloudError + '. Your progress is safe on this device and will sync when it can.' : 'Synced ' + cloudAgo();
        html = '<p>Signed in as <b>' + esc(cloudName || 'no name yet') + '</b> · ' + esc(maskEmail(cloudUser.email || '')) + '</p>' +
            '<p class="acct-status' + (cloudState === 'error' ? ' bad' : '') + '">' + status + '</p>' +
            '<div class="btn-row"><button class="ghost" id="acctSync">Sync now</button><button class="ghost" id="acctName">' +
            (cloudName ? 'Change name' : 'Choose a name') + '</button><button class="ghost" id="acctOut">Sign out</button></div>';
    }
    box.innerHTML = html;
    const on = (id, f) => {
        const b = $(id);
        if (b) {
            b.onclick = f;
        }
    };
    on('acctRetry', cloudInit);
    on('acctIn', cloudSignIn);
    on('acctSync', () => cloudSync());
    on('acctName', () => openNameDialog(!cloudName));
    on('acctOut', cloudSignOut);
}
setInterval(() => {
    if (cloudState === 'synced' && $('settings').classList.contains('active')) {
        renderAccount();
    }
}, 30000);
// Global top 10 and globals
let globalBoard = { odds: null, score: null, at: 0, error: false };
let globalSettings = { min_tier: 7, announce_top10: true, discord_enabled: true, banner_enabled: true };
let globalMode = 'odds';
let globalLoading = false;
const globalSent = new Set();
const globalKey = (f, ion) => f + '|' + (ion || 0);
function globalName(formula) {
    const counts = parseFormula(formula);
    const syms = Object.keys(counts);
    if (syms.length === 1 && counts[syms[0]] === 1) {
        return elementBySymbol[syms[0]] ? elementBySymbol[syms[0]][1] : formula;
    }
    const known = ACHIEVEMENTS.find(a => a.hill === formula);
    if (known) {
        return known.name;
    }
    return syms.map(s => (counts[s] > 1 ? counts[s] + ' × ' : '') + (elementBySymbol[s] ? elementBySymbol[s][1] : s)).join(' + ');
}
async function globalLoad() {
    if (!sb || globalLoading) {
        return;
    }
    globalLoading = true;
    const real = jokesOn() && !jokeHide ? '' : '_real';
    const [a, b, s] = await Promise.all([
        sb.from('global_top_odds' + real).select('id, formula, ion, odds_log, score, found_at, display_name'),
        sb.from('global_top_score' + real).select('id, formula, ion, odds_log, score, found_at, display_name'),
        sb.from('game_settings').select('min_tier, announce_top10, discord_enabled, banner_enabled').maybeSingle()
    ]);
    globalLoading = false;
    if (a.error || b.error) {
        globalBoard.error = true;
    } else {
        globalBoard = { odds: a.data || [], score: b.data || [], at: Date.now(), error: false };
    }
    if (s && !s.error && s.data) {
        globalSettings = s.data;
    }
    renderGlobal();
    globalFlushPending();
    globalBackfill();
}
// Finds waiting to be sent (made while the server couldn't be reached).
function globalPending() {
    try {
        return JSON.parse(localStorage.getItem('globalPending') || '[]').filter(p => p && p.f);
    } catch (e) {
        return [];
    }
}
function globalSetPending(list) {
    try {
        localStorage.setItem('globalPending', JSON.stringify(list.slice(-30)));
    } catch (e) { }
}
function globalBeats(rec) {
    const b = globalBoard;
    if (!b.odds || !b.score) {
        return true;
    }
    const onBoard = list => list.some(r => r.formula === rec.formula && (r.ion || 0) === (rec.ion || 0) && r.display_name === cloudName);
    if (onBoard(b.odds) || onBoard(b.score)) {
        return false;
    }
    const beats = (list, v, k) => list.length < 10 || v > list[list.length - 1][k] + 1e-9;
    return beats(b.odds, -rec.log, 'odds_log') || beats(b.score, rec.score, 'score');
}
// Called for every roll as it happens. Cheap: it only compares numbers already loaded.
function globalConsider(rec, old) {
    if (!CLOUD.enabled || !cloudUser || !cloudName || !rec || !rec.formula || !Number.isFinite(rec.log)) {
        return;
    }
    const isGlobal = !old && getRarityTier(rec.score) >= globalSettings.min_tier;
    if (!isGlobal && (globalSent.has(globalKey(rec.formula, rec.ion)) || !globalBeats(rec))) {
        return;
    }
    globalSent.add(globalKey(rec.formula, rec.ion));
    const st = activeBuffStats();
    globalSubmit({
        f: rec.formula,
        ion: rec.ion || 0,
        label: rec.name || globalName(rec.formula),
        rolls: totalRolls(),
        luck: Math.round(st.luck || 0),
        cats: (rec.cats || activeList().map(x => x.c && x.c.name).filter(Boolean)).join(', '),
        old: !!old
    });
}
async function globalSubmit(p) {
    if (!sb || !cloudUser) {
        globalQueue(p);
        return;
    }
    const args = { p_formula: p.f, p_label: p.label, p_rolls: p.rolls, p_luck: p.luck, p_catalysts: p.cats, p_old: p.old };
    if (p.ion) {
        args.p_ion = p.ion;
    }
    const { data, error } = await sb.rpc('submit_roll', args);
    if (error || !data) {
        globalSent.delete(globalKey(p.f, p.ion));
        globalQueue(p);
        return;
    }
    globalSetPending(globalPending().filter(x => !(x.f === p.f && (x.ion || 0) === (p.ion || 0) && x.old === p.old)));
    if (data.ok && data.added) {
        const parts = [];
        if (data.rank_odds <= 10) {
            parts.push('#' + data.rank_odds + ' by odds');
        }
        if (data.rank_score <= 10) {
            parts.push('#' + data.rank_score + ' by score');
        }
        showAchievementToast({ kicker: 'Global top 10', name: withIon(p.f, p.ion) + ' · ' + globalName(p.f), flavor: 'You are now ' + parts.join(' and ') + ' in the world.' });
        globalLoad();
    }
}
function globalQueue(p) {
    const list = globalPending();
    if (!list.some(x => x.f === p.f && (x.ion || 0) === (p.ion || 0) && x.old === p.old)) {
        list.push(p);
        globalSetPending(list);
    }
}
function globalFlushPending() {
    if (!sb || !cloudUser || !cloudName) {
        return;
    }
    const list = globalPending();
    globalSetPending([]);
    list.forEach(p => globalSubmit(p));
}
// After signing in: your best finds so far get a chance at the board too
function globalBackfill() {
    if (!cloudUser || !cloudName || !globalBoard.odds) {
        return;
    }
    try {
        if (localStorage.getItem('globalBackfilled') === cloudUser.id) {
            return;
        }
        localStorage.setItem('globalBackfilled', cloudUser.id);
    } catch (e) { }
    const best = groupedCollection().slice(0, 10).map(c => c.rarestRecord);
    const top = scoreRanked().slice(0, 10).map(c => c.rarestRecord);
    best.concat(top).forEach(r => globalConsider(r, true));
}
function globalRow(r, rank) {
    const el = document.createElement('div');
    const mine = cloudName && r.display_name === cloudName;
    el.className = 'rank-row' + (mine ? ' mine' : '');
    const when = new Date(r.found_at).toLocaleDateString([], { day: 'numeric', month: 'short', year: 'numeric' });
    el.innerHTML = '<div class="rank-num">' + rank + '</div><div class="rank-main"><div class="rank-formula">' + esc(withIon(r.formula, bondBonus().ion ? r.ion : 0)) + '</div>' +
        '<div class="rank-name">' + esc(globalName(r.formula)) + '</div></div><div class="rank-odds"><b>' +
        (globalMode === 'score' ? 'Score ' + fmtScore(r.score) : rarityText(-r.odds_log)) + '</b><span title="Found ' + esc(when) + '">' +
        esc(r.display_name || 'Unknown') + (mine ? ' (you)' : '') + '</span></div>';
    return el;
}
function renderGlobal() {
    const root = $('globalList');
    if (!root) {
        return;
    }
    const list = globalBoard[globalMode];
    const note = $('globalNote');
    const stat = $('globalStatus');
    root.innerHTML = '';
    if (!CLOUD.enabled) {
        root.innerHTML = '<div class="empty"><strong>The global top 10 is switched off in this copy of the game.</strong></div>';
        note.textContent = '';
        stat.textContent = '';
        return;
    }
    if (!list) {
        const down = globalBoard.error || cloudState === 'offline';
        root.innerHTML = '<div class="empty"><strong>' + (down ? "Can't reach the global top 10 right now." : 'Loading the global top 10…') + '</strong>' +
            (down ? '<p>Your rolls are still saved on this device. Check your connection and try again.</p><button class="ghost" id="globalRetry">Try again</button>' : '') + '</div>';
        const b = $('globalRetry');
        if (b) {
            b.onclick = () => (sb ? globalLoad() : cloudInit());
        }
    } else if (!list.length) {
        root.innerHTML = '<div class="empty"><strong>Nobody is on the board yet.</strong><p>The first signed-in players to roll will fill it.</p></div>';
    } else {
        list.forEach((r, i) => root.appendChild(globalRow(r, i + 1)));
    }
    stat.textContent = globalBoard.at ? 'Updated ' + new Date(globalBoard.at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '';
    note.innerHTML = !cloudUser ? 'Only signed-in players appear here. <button class="linkish" data-go-settings>Sign in from Settings</button> to put your rolls on the board.' :
        !cloudName ? 'Choose a display name in Settings to put your rolls on the board.' :
        'Your rolls are entered automatically when they are rare enough to make the board. Odds and score are always base values, before any buffs.';
    const s = note.querySelector('[data-go-settings]');
    if (s) {
        s.onclick = () => go('settings');
    }
    const home = $('homeGlobal');
    if (home) {
        const mineAt = (globalBoard.odds || []).findIndex(r => cloudName && r.display_name === cloudName);
        home.textContent = mineAt >= 0 ? 'You are #' + (mineAt + 1) : globalBoard.odds && globalBoard.odds[0] ? 'Top ' + rarityText(-globalBoard.odds[0].odds_log) : '';
    }
}
document.querySelectorAll('[data-grank]').forEach(b => b.addEventListener('click', () => {
    globalMode = b.dataset.grank;
    document.querySelectorAll('[data-grank]').forEach(x => x.classList.toggle('active', x === b));
    renderGlobal();
}));
setInterval(() => {
    if ($('global').classList.contains('active') && document.visibilityState === 'visible') {
        globalLoad();
    }
}, 60000);
// the banner: other players' globals, live. The connection is only open while
// the game is on screen, so idle tabs don't use up the server's live connections.
let rtChannel = null;
const bannerQueue = [];
let bannerBusy = false;
function rtStart() {
    if (!sb || rtChannel || !CLOUD.enabled || document.visibilityState !== 'visible') {
        return;
    }
    rtChannel = sb.channel('globals')
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'announcements' }, p => bannerAdd(p.new))
        .subscribe();
}
function rtStop() {
    if (sb && rtChannel) {
        sb.removeChannel(rtChannel);
    }
    rtChannel = null;
}
const jokeHidden = formula => (!jokesOn() || jokeHide) && Object.keys(parseFormula(formula || '')).some(isJoke);
function bannerAdd(a) {
    if (!a || !globalSettings.banner_enabled || (cloudName && a.display_name === cloudName) || jokeHidden(a.formula)) {
        return;
    }
    if (bannerQueue.length < 5) {
        bannerQueue.push(a);
    }
    bannerNext();
}
function bannerNext() {
    const el = $('globalBanner');
    if (bannerBusy || !bannerQueue.length || !el) {
        return;
    }
    bannerBusy = true;
    const a = bannerQueue.shift();
    const fx = RARITY_FX[Math.min(12, a.tier)];
    el.style.setProperty('--bc', fx ? fx.c : 'var(--hazard)');
    el.innerHTML = '<b>' + esc(a.display_name) + '</b> has found <b>' + esc((a.label || globalName(a.formula)) + (bondBonus().ion ? ionText(a.ion || 0) : '')) + '</b><span>' +
        (displayMode === 'score' ? 'Score ' + fmtScore(a.score) : rarityText(-a.odds_log)) + '</span>';
    el.classList.add('show');
    setTimeout(() => {
        el.classList.remove('show');
        setTimeout(() => {
            bannerBusy = false;
            bannerNext();
        }, 450);
    }, 5500);
}
// gifts from the admin, handed over when you sign in or come back to the game
async function giftsClaim() {
    if (!sb || !cloudUser || !cloudName) {
        return;
    }
    const { data, error } = await sb.rpc('claim_gifts');
    if (error || !Array.isArray(data) || !data.length) {
        return;
    }
    const got = [];
    data.forEach(g => {
        if (CAT[g.catalyst] && g.qty > 0) {
            catInv[g.catalyst] = (catInv[g.catalyst] || 0) + g.qty;
            got.push(g.qty + ' × ' + CAT[g.catalyst].name);
        }
    });
    if (!got.length) {
        return;
    }
    saveCats();
    if ($('catinv').classList.contains('active')) {
        renderCatInv();
    }
    const note = data.map(g => g.note).filter(Boolean)[0];
    showAchievementToast({ kicker: 'Gift received', name: got.join(', '), flavor: note || 'Added to your catalyst inventory.' });
    cloudTick();
}
document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
        rtStart();
        giftsClaim();
    } else {
        rtStop();
    }
});
// Everything that needs a signed-in player with a name
function cloudAfterProfile() {
    renderGlobal();
    globalFlushPending();
    globalBackfill();
    giftsClaim();
    adminCheck();
}
// Admin tab: only shown to the admin account
let isAdmin = false;
async function adminCheck() {
    if (!sb || !cloudUser) {
        adminShow(false);
        return;
    }
    const { data } = await sb.rpc('is_admin');
    adminShow(data === true);
}
function adminShow(on) {
    isAdmin = !!on;
    document.querySelectorAll('.admin-only').forEach(e => e.hidden = !isAdmin);
    if (!isAdmin && $('admin').classList.contains('active')) {
        go('menu');
    }
}
function admMsg(id, text, bad) {
    const el = $(id);
    if (el) {
        el.textContent = text;
        el.classList.toggle('bad', !!bad);
    }
}
async function admCall(fn, args, msgId) {
    const { data, error } = await sb.rpc(fn, args || {});
    if (error) {
        admMsg(msgId, /not allowed/.test(error.message || '') ? 'Only the admin account can do that.' : 'Could not reach the server. Try again.', true);
        return { error };
    }
    return { data };
}
function renderAdmin() {
    if (!isAdmin) {
        return;
    }
    // what counts as a global
    const sel = $('admTier');
    if (!sel.options.length) {
        TIER_SCORES.forEach((min, i) => sel.add(new Option('Tier ' + (i + 1) + ' and above (score ' + fmtScore(min) + '+)', i + 1)));
        sel.add(new Option('No tier: only new global top 10 entries', 13));
    }
    sel.value = globalSettings.min_tier;
    $('admTop10').checked = globalSettings.announce_top10;
    $('admDiscord').checked = globalSettings.discord_enabled;
    $('admBanner').checked = globalSettings.banner_enabled;
    admMsg('admSetMsg', '');
    // giveaway catalyst list
    const cat = $('admCat');
    if (!cat.options.length) {
        CAT_TIERS.forEach((t, ti) => {
            const g = document.createElement('optgroup');
            g.label = t.name;
            CATALYSTS.filter(c => c.tier === ti).forEach(c => g.appendChild(new Option(c.name, c.id)));
            cat.appendChild(g);
        });
    }
    admPlayers();
    admBoard();
    admGifts();
}
$('admSave').onclick = async () => {
    const s = { p_min_tier: +$('admTier').value, p_top10: $('admTop10').checked, p_discord: $('admDiscord').checked, p_banner: $('admBanner').checked };
    admMsg('admSetMsg', 'Saving…');
    const r = await admCall('admin_settings', s, 'admSetMsg');
    if (!r.error) {
        globalSettings = { min_tier: s.p_min_tier, announce_top10: s.p_top10, discord_enabled: s.p_discord, banner_enabled: s.p_banner };
        admMsg('admSetMsg', 'Saved. Players pick this up the next time their game loads the board.');
    }
};
$('admTest').onclick = async () => {
    admMsg('admSetMsg', 'Sending a test post…');
    const r = await admCall('admin_test_discord', {}, 'admSetMsg');
    if (!r.error) {
        admMsg('admSetMsg', r.data === 'ok' ? (globalSettings.discord_enabled ? 'Test post sent. Check your Discord channel.' : 'Discord posts are switched off above, so nothing was sent.') :
            'No Discord webhook saved yet. Add it in Supabase first (see the setup steps).', r.data !== 'ok');
    }
};
async function admPlayers() {
    const q = $('admFind').value.trim();
    const list = $('admPlayerList');
    list.innerHTML = '<p class="adm-note">Loading…</p>';
    const r = await admCall('admin_players', { p_query: q }, 'admBanMsg');
    if (r.error) {
        list.innerHTML = '';
        return;
    }
    const rows = r.data || [];
    list.innerHTML = rows.length ? '' : '<p class="adm-note">No players match.</p>';
    rows.forEach(p => {
        const el = document.createElement('div');
        el.className = 'adm-row' + (p.banned ? ' banned' : '');
        el.innerHTML = '<div><b>' + esc(p.display_name) + '</b>' + (p.banned ? ' <span class="adm-tag">Banned</span>' : '') +
            '<small>Joined ' + new Date(p.joined).toLocaleDateString([], { day: 'numeric', month: 'short', year: 'numeric' }) +
            ' · ' + formatNumber(p.submissions) + ' rolls sent · ' + formatNumber(p.globals) + ' globals' +
            (p.best_odds_log ? ' · best ' + rarityText(-p.best_odds_log) : '') + (p.banned && p.ban_reason ? ' · reason: ' + esc(p.ban_reason) : '') + '</small></div>' +
            (p.display_name === cloudName ? '<small>You</small>' : '<button class="ghost">' + (p.banned ? 'Unban' : 'Ban') + '</button>');
        const btn = el.querySelector('button');
        list.appendChild(el);
        if (!btn) {
            return;
        }
        btn.onclick = async () => {
            const reason = p.banned ? '' : $('admReason').value.trim();
            const res = await admCall('admin_ban', { p_name: p.display_name, p_reason: reason, p_banned: !p.banned }, 'admBanMsg');
            if (!res.error) {
                admMsg('admBanMsg', res.data === 'is_admin' ? "The admin account can't be banned." : res.data === 'ok' ? (p.banned ? p.display_name + ' is unbanned.' : p.display_name + ' is banned and hidden from the board.') : 'Player not found.', res.data !== 'ok');
                admPlayers();
                admBoard();
                globalLoad();
            }
        };
        list.appendChild(el);
    });
}
$('admFindBtn').onclick = admPlayers;
$('admFind').onkeydown = e => {
    if (e.key === 'Enter') {
        admPlayers();
    }
};
async function admBoard() {
    const list = $('admBoardList');
    const r = await admCall('admin_board', {}, 'admBoardMsg');
    if (r.error) {
        return;
    }
    const rows = r.data || [];
    list.innerHTML = rows.length ? '' : '<p class="adm-note">Nothing has been entered yet.</p>';
    rows.forEach(g => {
        const el = document.createElement('div');
        el.className = 'adm-row' + (g.removed || g.banned ? ' banned' : '');
        el.innerHTML = '<div><b>' + esc(withIon(g.formula, g.ion)) + '</b> · ' + esc(g.display_name) + (g.removed ? ' <span class="adm-tag">Removed</span>' : '') +
            (g.banned ? ' <span class="adm-tag">Player banned</span>' : '') + '<small>' + rarityText(-g.odds_log) + ' · score ' + fmtScore(g.score) + ' · ' +
            new Date(g.found_at).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' }) + '</small></div><button class="ghost">' + (g.removed ? 'Restore' : 'Remove') + '</button>';
        el.querySelector('button').onclick = async () => {
            const res = await admCall('admin_remove', { p_id: g.id, p_removed: !g.removed }, 'admBoardMsg');
            if (!res.error) {
                admMsg('admBoardMsg', g.formula + (g.removed ? ' is back on the board.' : ' is removed from the board.'));
                admBoard();
                globalLoad();
            }
        };
        list.appendChild(el);
    });
}
$('admGive').onclick = async () => {
    const everyone = $('admWhoAll').checked;
    const name = everyone ? '' : $('admWho').value.trim();
    const qty = Math.floor(+$('admQty').value);
    if (!everyone && !name) {
        admMsg('admGiftMsg', "Type the player's display name, or choose Everyone.", true);
        return;
    }
    if (!(qty >= 1 && qty <= 10000)) {
        admMsg('admGiftMsg', 'Choose an amount from 1 to 10,000.', true);
        return;
    }
    const c = CAT[$('admCat').value];
    admMsg('admGiftMsg', 'Sending…');
    const r = await admCall('admin_give', { p_name: name, p_catalyst: c.id, p_qty: qty, p_note: $('admNote').value.trim() }, 'admGiftMsg');
    if (!r.error) {
        admMsg('admGiftMsg', r.data === 'ok' ? qty + ' × ' + c.name + ' sent to ' + (everyone ? 'everyone' : name) + '. Players receive it the next time they open the game.' :
            r.data === 'not_found' ? 'No player has that display name.' : 'That gift could not be made.', r.data !== 'ok');
        if (r.data === 'ok') {
            $('admNote').value = '';
            admGifts();
        }
    }
};
document.querySelectorAll('input[name=admWhoMode]').forEach(r => r.onchange = () => {
    $('admWho').disabled = $('admWhoAll').checked;
});
async function admGifts() {
    const list = $('admGiftList');
    const r = await admCall('admin_gifts', {}, 'admGiftMsg');
    if (r.error) {
        return;
    }
    const rows = r.data || [];
    list.innerHTML = rows.length ? '' : '<p class="adm-note">No gifts sent yet.</p>';
    rows.forEach(g => {
        const el = document.createElement('div');
        el.className = 'adm-row';
        el.innerHTML = '<div><b>' + g.qty + ' × ' + esc(CAT[g.catalyst] ? CAT[g.catalyst].name : g.catalyst) + '</b> to ' + esc(g.recipient) +
            '<small>' + new Date(g.at).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' }) + ' · received by ' + g.claimed +
            (g.note ? ' · "' + esc(g.note) + '"' : '') + '</small></div>';
        list.appendChild(el);
    });
}
const AWAY_MAX = 24 * 3600;
const awayMax = () => AWAY_MAX + bondBonus().away * 3600;
const AWAY_SLOWER = 10;
const trustedNow = () => clockBase ? clockBase.server + (performance.now() - clockBase.perf) : null;
async function clockSync() {
    if (!CLOUD.enabled) {
        // the preview copy has no server to ask
        clockBase = { server: Date.now(), perf: performance.now() };
        return true;
    }
    if (!sb) {
        return false;
    }
    const t0 = performance.now();
    const { data, error } = await sb.rpc('server_time');
    const t1 = performance.now();
    const ms = typeof data === 'string' ? Date.parse(data) : NaN;
    if (error || !Number.isFinite(ms)) {
        return false;
    }
    clockBase = { server: ms + (t1 - t0) / 2, perf: t1 };
    return true;
}
// the last time the game was seen open, in server time ({ t: null } = couldn't be checked)
let awaySince = null;
try {
    const v = JSON.parse(localStorage.getItem('awayLastSeen') || 'null');
    awaySince = v && typeof v === 'object' ? v : null;
} catch (e) { }
function awayStamp() {
    const t = trustedNow();
    if (t == null) {
        return;
    }
    try {
        localStorage.setItem('awayLastSeen', JSON.stringify({ t: Math.round(t) }));
    } catch (e) { }
}
// keep the "last seen" time fresh, so it is right even if a phone closes the page without warning
setInterval(awayStamp, 15000);
addEventListener('pagehide', awayStamp);
document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') {
        awayStamp();
    } else if (clockBase) {
        clockSync();
    }
});
// how many rolls the time away is worth: autoroll's full cycle (roll + break), ten times slower
function awayRollsFor(seconds) {
    const b = activeBuffStats();
    if (!b.autoUnlocked || !(seconds > 0)) {
        return 0;
    }
    const rollSec = Math.max(300, 3000 / (1 + b.speed / 100)) / 1000;
    const cycle = (b.autoGap + rollSec + 1) * AWAY_SLOWER;
    return Math.floor(seconds / cycle) * (1 + b.extra);
}
function awayMakeRoll(b, ev) {
    const make = () => rollElements(0, null, { denom: ev === 'collider' ? 2 : b.chainDenom });
    const elements = ev === 'hole' ? rollTwice(make) : make();
    const formula = hillFormula(elements);
    const log = exactRarity(elements, 0);
    const known = ACHIEVEMENTS.find(a => a.hill === formula);
    const name = elements.length === 1 ? elements[0][1] : (known ? known.name : elements.map(e => e[1]).join(' + '));
    return ionise({ elements, formula, name, log, rarity: rarityText(log), score: rollScore(elements) }, rollIon());
}
function awayClock(s) {
    s = Math.max(0, Math.floor(s));
    return Math.floor(s / 3600) + ':' + String(Math.floor(s % 3600 / 60)).padStart(2, '0') + ':' + String(s % 60).padStart(2, '0');
}
// wait until accounts have settled, so away rolls never clash with a save from another device
function awayWaitForCloud() {
    return new Promise(resolve => {
        const t0 = Date.now();
        (function check() {
            const settled = !CLOUD.enabled || ['offline', 'signedout', 'disabled', 'error'].includes(cloudState) || (cloudUser && cloudProfileReady);
            if (settled || (cloudState !== 'choose' && Date.now() - t0 > 8000)) {
                resolve();
            } else {
                setTimeout(check, 200);
            }
        })();
    });
}
async function awayProcess() {
    await awayWaitForCloud();
    const clockOk = await clockSync();
    clockTried = true;
    if (!clockOk) {
        // the time can't be checked, so this session can't be trusted as time away later either
        try {
            localStorage.setItem('awayLastSeen', JSON.stringify({ t: null }));
        } catch (e) { }
        return;
    }
    const since = awaySince && typeof awaySince.t === 'number' ? awaySince.t : null;
    awayStamp();
    if (since == null) {
        return;
    }
    const seconds = Math.min(awayMax(), Math.max(0, (trustedNow() - since) / 1000));
    const n = awayRollsFor(seconds);
    if (n < 1) {
        return;
    }
    const b = activeBuffStats();
    const index = new Map(collection.map(c => [c.formula, c]));
    const firstFinds = [];
    const hist = [];
    let total = totalRolls();
    let earned = 0;
    let best = null;
    // storms work per press of Roll, and each press is (1 + bonus rolls) rolls
    const per = 1 + b.extra;
    const stormWas = qStormOn();
    let stormAdd = null;
    let stormQ = 0;
    let stormStarted = false;
    const evSeen = {};
    const drops = {};
    let ev = null;
    for (let i = 0; i < n; i++) {
        if (i % per === 0) {
            ev = eventNow();
            const sp = eventsPress(Math.min(per, n - i));
            stormAdd = sp && !sp.ev && sp.add;
            stormStarted = stormStarted || !!(sp && !sp.ev && sp.started);
        }
        if (ev && ev !== 'storm') {
            evSeen[ev] = (evSeen[ev] || 0) + 1;
        }
        if (stormAdd) {
            earned += stormAdd[i % per];
            stormQ += stormAdd[i % per];
        }
        const r = awayMakeRoll(b, ev);
        if (!best || (displayMode === 'score' ? r.score > best.score : r.log < best.log)) {
            best = r;
        }
        let x = index.get(r.formula);
        if (!x) {
            const lg = r.ion ? r.baseLog : r.log;
            x = { formula: r.formula, name: r.name, elements: r.elements, rarity: rarityText(lg), log: lg, score: r.ion ? r.baseScore : r.score, count: 0 };
            collection.push(x);
            index.set(r.formula, x);
            firstFinds.push(x);
        }
        x.count++;
        if (r.ion > 0) {
            x.ionP = Math.max(x.ionP || 0, r.ion);
        } else if (r.ion < 0) {
            x.ionN = Math.max(x.ionN || 0, -r.ion);
        }
        ionCredit(r.elements[0][0], r.ion);
        total++;
        earned += quarksFor(r.score, quarkMult(r.elements, b));
        const d = rollDrop();
        if (d) {
            drops[d] = (drops[d] || 0) + 1;
        }
        if (n - i <= HISTORY_MAX) {
            hist.push(r.ion ? { n: total, f: r.formula, l: r.log, s: r.score, i: r.ion } : { n: total, f: r.formula, l: r.log, s: r.score });
        }
    }
    renderQStorm();
    rollHistory = hist.reverse().concat(rollHistory).slice(0, HISTORY_MAX);
    try {
        localStorage.setItem('elementalHistory', JSON.stringify(rollHistory));
    } catch (e) { }
    save();
    addQuarks(earned);
    firstFinds.forEach(r => checkAchievements(r));
    renderHistory();
    renderInventory();
    renderPeriodic();
    if (typeof renderHome === 'function') {
        renderHome();
    }
    // only the rarest is played, shown and sent on
    const rec = Object.assign({}, best, { id: Date.now() + Math.random(), when: new Date().toISOString() });
    globalConsider(rec);
    go('game');
    while (rolling) {
        await new Promise(r => setTimeout(r, 100));
    }
    await doRoll([best]);
    const w = openDialog('<h2>While you were away</h2>' +
        '<p class="away-big">You rolled <b>' + formatNumber(n) + '</b> times while you were away.</p>' +
        '<p class="away-clock">' + awayClock(seconds) + ' / ' + awayClock(awayMax()) + '</p>' +
        '<dl class="away-best"><dt>Your rarest find was</dt><dd>' + esc(best.name) + ' <span>' + esc(withIon(best.formula, best.ion)) + '</span></dd>' +
        '<dt>With ' + (displayMode === 'score' ? 'a score' : 'odds') + ' of</dt><dd>' + (displayMode === 'score' ? fmtScore(best.score) : rarityText(best.log)) + '</dd></dl>' +
        (stormQ || stormStarted ? '<p class="away-storm"><b>Quark Storm</b> ' + (stormStarted || !stormWas ? 'hit while you were away' : qStormOn() ? 'carried on while you were away' : 'blew itself out while you were away') +
            (stormQ ? ': +' + formatNumber(stormQ) + ' quarks' : '') + '.' + (qStormOn() ? ' It is still going, with ' + qStorm.left + ' rolls left.' : '') + '</p>' : '') +
        (Object.keys(drops).length ? '<p class="away-storm"><b>Catalysts found</b> ' + Object.keys(drops).map(id => drops[id] + ' × ' + CAT[id].name).join(', ') + '.</p>' : '') +
        Object.keys(evSeen).map(id => '<p class="away-storm ev-' + id + '"><b>' + EVENTS[id].name + '</b> covered ' + formatNumber(evSeen[id]) + ' of your rolls while you were away.' + (evOn(id) ? ' It is still going, with ' + evRun.left + ' rolls left.' : '') + '</p>').join('') +
        '<div class="btn-row"><button class="primary" id="awayOk">Nice</button></div>');
    w.querySelector('#awayOk').onclick = closeDialog;
}
// first time tutorial, a fresh save only
const onScreen = id => $(id).classList.contains('active');
const TUT = [
    { on: 'menu', at: '.roll-cta', say: 'Welcome to Elemental. Every roll pulls elements from the periodic table, and the rarer they are the more they\'re worth. Tap Roll to start.', done: () => onScreen('game') },
    { on: 'game', at: '#rollBtn', roll: 'O', say: 'Press Roll.' },
    { on: 'game', at: '#rollBtn', roll: 'He', say: 'Oxygen, one of the most common elements there is. Every element has its own odds. Roll again.' },
    { on: 'game', at: '#rollBtn', roll: 'N', say: 'Helium. Once more.' },
    { at: '#game [data-go="inventory"]', say: 'Nitrogen. Everything you roll is kept in your collection. Open it.', done: () => onScreen('inventory') },
    { at: '[data-tab="completionist"]', say: 'Your best finds are ranked here. Tap All elements for the periodic table.', done: () => $('completionView').style.display !== 'none' },
    { at: '#periodic [data-sym="O"]', say: 'Elements light up once you\'ve found them. Tap oxygen.', done: () => onScreen('element') },
    { at: '#elementBuffPanel', say: 'Every element has a bonus, and it\'s yours for good from the first time you find it.' },
    { on: 'bonds', way: 'Next up, your bonds tree.', say: 'This is your bonds tree. Each slot asks for something you\'ve rolled, and filling it lights up the line to it for a bonus. Tap the glowing slot in the middle to put your oxygen in.', done: () => netFilled(0) },
    { on: 'bonds', say: 'The slots next to it want helium and nitrogen. Fill them both.', done: () => netFilled(1) && netFilled(2) },
    { on: 'bonds', say: 'Those rolls are used up now, but the bonuses stay. The tree goes a long way out.' },
    { on: 'shop', way: 'Next, the catalyst shop.', at: '#shopTimer', say: 'The catalyst shop. Catalysts boost your luck, your speed and plenty more for a while. They cost quarks, which every roll earns, and the stock changes on a timer.' },
    { on: 'catinv', way: 'Now your inventory.', say: 'Catalysts you buy wait in your inventory until you use them. Yours is empty for now.' },
    { on: 'settings', way: 'On to Settings.', at: '#accountBody', say: 'Signing in with Google is optional. It keeps your save in the cloud and puts you on the global top 10. You can do it now or any time.' },
    { on: 'settings', say: 'Settings is also where you change the theme and sound, turn down flashing, and watch again any effect you\'ve seen.' },
    { on: 'game', way: 'Back to rolling.', at: '#qStormBar', storm: true, say: 'Every so often an event starts. Here\'s one on the house: a Quark Storm. Every roll earns extra quarks until it runs out.' },
    { on: 'game', say: 'That\'s all you need to get going. Expect the unexpected, there are many more secrets to uncover.' }
];
let tutAt = -1;
let tutScript = null;
let tutBox = null;
let tutSpot = null;
let tutTimer = 0;
function tutTake() {
    const s = tutScript;
    tutScript = null;
    return s;
}
function tutEnd() {
    tutAt = -1;
    tutScript = null;
    clearInterval(tutTimer);
    if (tutSpot) {
        tutSpot.classList.remove('tut-spot');
    }
    if (tutBox) {
        tutBox.remove();
        tutBox = null;
    }
    try {
        localStorage.setItem('elementalTutorial', 'done');
    } catch (e) { }
}
function tutShow(i) {
    const s = TUT[i];
    if (!s) {
        return tutEnd();
    }
    tutAt = i;
    try {
        localStorage.setItem('elementalTutorial', i);
    } catch (e) { }
    const found = s.roll && discoveredSymbols().has(s.roll);
    tutScript = s.roll && !found ? s.roll : null;
    if (!tutBox) {
        tutBox = document.createElement('div');
        tutBox.className = 'tut';
        tutBox.setAttribute('role', 'dialog');
        tutBox.setAttribute('aria-live', 'polite');
        tutBox.innerHTML = '<p></p><div class="btn-row"><button class="ghost tut-skip">Skip tutorial</button><button class="primary tut-next">Next</button></div>';
        tutBox.querySelector('.tut-skip').onclick = tutEnd;
        tutBox.querySelector('.tut-next').onclick = () => tutShow(tutAt + 1);
        document.body.appendChild(tutBox);
    }
    const last = i === TUT.length - 1;
    tutBox.querySelector('.tut-next').textContent = last ? 'Start playing' : 'Next';
    tutBox.querySelector('.tut-skip').hidden = last;
    clearInterval(tutTimer);
    tutTimer = setInterval(tutTick, 250);
    tutTick();
}
function tutTick() {
    const s = TUT[tutAt];
    if (!s) {
        return;
    }
    if (s.roll ? discoveredSymbols().has(s.roll) && !rolling : s.done && s.done()) {
        return tutShow(tutAt + 1);
    }
    // not there yet: point at the next button on the way
    const hop = s.on && !onScreen(s.on) ? tutHop(s.on) : null;
    let say = s.say;
    let el;
    if (hop) {
        const name = (hop.querySelector('span') || hop).textContent.trim();
        say = (s.way ? s.way + ' ' : '') + 'Tap ' + name + '.';
        el = hop;
    } else {
        if (s.storm && !qStormOn()) {
            qStormStart();
            renderQStorm();
        }
        // the page redraws a lot, so the highlight is found again each time
        el = s.at && document.querySelector(s.at);
        el = el && el.closest('.screen.active') ? el : null;
    }
    const p = tutBox.querySelector('p');
    if (p.textContent !== say) {
        p.textContent = say;
    }
    tutBox.querySelector('.tut-next').hidden = !!(hop || s.done || s.roll);
    if (el !== tutSpot) {
        if (tutSpot) {
            tutSpot.classList.remove('tut-spot');
        }
        tutSpot = el;
        if (el) {
            el.classList.add('tut-spot');
            el.scrollIntoView({ block: 'center', behavior: 'smooth' });
        }
    }
    const r = el && el.getBoundingClientRect();
    tutBox.classList.toggle('top', !!r && r.top + r.height / 2 > innerHeight * 0.55);
}
function tutHop(to) {
    const cur = document.querySelector('.screen.active');
    if (cur.id === 'element') {
        return $('elemBack');
    }
    // the inventory is only linked from the shop and roll screens
    const via = to === 'catinv' && !cur.querySelector('[data-go="catinv"]') ? 'shop' : to;
    return cur.querySelector('[data-go="' + via + '"]') || cur.querySelector('[data-go="menu"]');
}
function tutInit() {
    let v = null;
    try {
        v = localStorage.getItem('elementalTutorial');
    } catch (e) { }
    if (v === 'done') {
        return;
    }
    // an older save, or one that just came down from the cloud
    if (v == null && totalRolls() > 0 || cloudGet('elementalCloudFresh') === '1') {
        return tutEnd();
    }
    tutShow(+v || 0);
}
cloudInit();
awayProcess();
tutInit();
