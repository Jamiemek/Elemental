// Built by tools/build.py from the files in js/. Edit those, not this file.
// Builds with a new SAVE_VERSION start from a blank slate. Old progress is kept under
// 'legacyElementalBackup' instead of being deleted.
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
    1: true, 2: true, 3: true, 4: true, 5: true, 6: true, 7: true, 8: true, 9: true
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
    1: true, 2: true, 3: true, 4: true, 5: true, 6: true, 7: true, 8: true, 9: true
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
// Tier 1 starts at 1 in 10,000 and each tier is ten times rarer, up to tier 9 at 1 in a trillion.
// Effect tiers are set by score: the base odds of every element in the roll added together.
const TIER_SCORES = [10000, 30000, 100000, 250000, 500000, 1000000, 1500000, 3000000, 12000000];
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
// ---- secret (dark) sounds: no chimes, nothing in tune
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
    } else {
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
    } else {
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
    { c: '#fff6d6', c2: '#ff7ad9', ms: 8000, vd: 4320, hb: [0, 900, 1700, 2400, 3000, 3500, 3900] }
];
// Secret variants for tiers 5 to 9: about 1 in 10 of those rolls play these instead.
const SECRET_CHANCE = 0.1;
const RARITY_DARK = [
    null, null, null, null, null,
    { c: '#b3201c', c2: '#2a0404', ms: 4600 },
    { c: '#e0261c', c2: '#3a0000', ms: 5600 },
    { c: '#9dff3a', c2: '#0b2205', ms: 6400 },
    { c: '#ff2a2a', c2: '#160000', ms: 6200, vd: 2400, hb: [400, 1150, 1320, 1900, 2040, 2230] },
    { c: '#ff2a2a', c2: '#5a0000', ms: 8400, vd: 4320, hb: [0, 700, 1600, 1760, 2600, 3100, 3260, 3700, 3950, 4120] }
];
let rarityEffectTimer = null;
let fxRunId = 0;
let runningFx = [];
// Reduce flashing: full-screen layers can't change brightness faster than about
// 0.4 opacity per quarter second, never pass 45%, and stepped flickers become smooth.
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
// ---------------------------------------------------------------------------
// Rarity effects. Fully visual, no text. Each tier builds on the one below it:
//  1  a light sweep and a soft ring around the roll window
//  2  light traces the roll window's edge and the window breathes
//  3  the page falls out of focus around the roll window, which lifts forward
//  4  a shockwave pushes the page outward and it springs back
//  5  the page tips back in 3D under a fall of golden light
//  6  an impact shakes and ripples the page, embers and sparks
//  7  two impacts: the page flashes to negative and scatters, then reassembles
//  8  the page is drawn into the roll window over a heartbeat, then released
//  9  the page comes apart and drifts into a starfield, then reforms in white light
// ---------------------------------------------------------------------------
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
// Particle field. `plan` is a list of emitters:
//  { type: 'burst'|'spiral'|'embers'|'rain'|'stars'|'galaxy', at, until, n, rate, cols, ... }
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
    // ---- building blocks
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
    // ---- secret (dark) variants for tiers 5 to 9
    if (dark) {
        // jagged crack lines spreading out from a point, drawn on over `dur`
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
        done();
        return;
    }
    // ---- the tiers
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
// Quark Storm particles: small glowing quarks in the three colour charges, some alone and some
// bound in threes by wiggly gluon lines, swirling round the scan as they fly in.
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
function scanField(reel, syms, labels, scores, dur, targets, storm) {
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
            const pr = (x, y, d) => [W / 2 + (x - cxw) * Pp / d, H / 2 + (y - cyw) * Pp / d];
            P.forEach(p => {
                let d = p.z - cz;
                if (d < 0.35) {
                    spawn(p, 13 + Math.random() * 2, cz);
                    d = p.z - cz;
                }
                const [sx, sy] = pr(p.x, p.y, d);
                if (sx < -60 || sx > W + 60 || sy < -60 || sy > H + 60) {
                    return;
                }
                const a = Math.min(1, (d - 0.35) / 0.9) * (d > 10 ? (14 - d) / 4 : 1) * 0.8 * (1 - q * 0.92);
                if (a <= 0) {
                    return;
                }
                if (q > 0) {
                    const [ex, ey] = pr(p.x, p.y, d + q * q * 3.5);
                    g.globalAlpha = a * 0.7;
                    g.strokeStyle = tier ? acc : '#9fe0c8';
                    g.lineWidth = 1.5;
                    g.beginPath();
                    g.moveTo(sx, sy);
                    g.lineTo(ex, ey);
                    g.stroke();
                }
                g.globalAlpha = a;
                g.fillStyle = '#cfe3da';
                g.font = '700 ' + Math.max(5, base * p.s / d) + 'px ' + fam;
                g.fillText(p.t, sx, sy);
            });
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
                g.fillStyle = hl ? (u > 0.65 ? '#eef3ef' : ac) : '#cfe3da';
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
            if (storm) {
                g.textAlign = 'left';
                g.fillStyle = '#f0c419';
                g.globalAlpha = 0.75 + 0.25 * Math.sin(t / 160);
                g.fillText('QUARK STORM', 18, H - 18);
                g.fillStyle = acc;
                g.globalAlpha = 0.9;
            }
            g.textBaseline = 'middle';
            g.textAlign = 'center';
            if (u < 0.65) {
                g.globalAlpha = 0.25;
                g.strokeStyle = '#cfe3da';
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
// The collection is saved compactly: one [formula, count, spent] per formula, about
// 20 bytes each. Elements, name, odds and score are rebuilt from the formula on load,
// so they always match the current element odds. Older saves (one full object per
// formula, about 300 bytes each) are read the same way and shrink on the next save.
let achNameByFormula = null;
function recordFromFormula(formula, count, spent) {
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
    return r;
}
function unpackCollection(raw) {
    if (!Array.isArray(raw)) {
        return [];
    }
    const out = [];
    const seen = new Map();
    raw.forEach(x => {
        const r = Array.isArray(x) ? recordFromFormula(x[0], x[1], x[2]) : x && recordFromFormula(x.formula, x.count, x.spent);
        if (!r) {
            return;
        }
        const dup = seen.get(r.formula);
        if (dup) {
            dup.count += r.count;
            dup.spent = (dup.spent || 0) + (r.spent || 0) || undefined;
            return;
        }
        seen.set(r.formula, r);
        out.push(r);
    });
    return out;
}
function packCollection() {
    return JSON.stringify(collection.map(c => c.spent > 0 ? [c.formula, c.count || 1, c.spent] : [c.formula, c.count || 1]));
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
    const x = collection.find(c => c.formula === r.formula);
    if (!x) {
        r.count = 1;
        collection.push(r);
        return;
    }
    x.count = (x.count || 1) + 1;
    if (r.log < x.log || !Number.isFinite(x.log)) {
        Object.assign(x, {
            log: r.log, rarity: r.rarity, score: r.score, when: r.when, elements: r.elements, id: r.id, name: r.name
        });
    }
}
function go(screen) {
    document.querySelectorAll('.screen').forEach(s => s.classList.toggle('active', s.id === screen));
    window.scrollTo(0, 0);
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
    }
}));
// Exactly three elements grant an extra roll per click.
const EXTRA_ROLL_SYMBOLS = new Set(['Ho']);
const CHAIN_SYMBOLS = new Set(['Rn', 'Bk', 'Ds', 'Og']);
const AUTO_UNLOCK_SYMBOL = 'Pt';
const AUTO_TIME_SYMBOLS = new Set(['Cs', 'Sm', 'Os', 'Tm', 'Ac']);
const AUTO_COOL_SYMBOLS = new Set(['Pr', 'Lu', 'Rh', 'Pa', 'Po']);
// Autoroll waits AUTO_BASE_GAP seconds between rolls; autoroll speed shortens the wait,
// down to AUTO_MIN_GAP (rolling back to back), which is the fastest it can go.
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
function discoveredSymbols() {
    const set = new Set();
    collection.forEach(c => (c.elements || []).forEach(e => set.add(e[0])));
    return set;
}
// ---------------------------------------------------------------------------
// Bond network. One fixed-seed network grows outward from a single oxygen.
// Every line between two slots holds a buff, switched on once both ends are filled.
// Filling a slot spends what it asks for (tracked as `spent` on collection records,
// so roll totals, finds and records never change).
// ---------------------------------------------------------------------------
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
const NET_RING_COL = ['#f0c419', '#7ddc5a', '#7ddc5a', '#7ddc5a', '#2fe0b0', '#2fe0b0', '#2fe0b0', '#35d0e0', '#35d0e0', '#35d0e0', '#5aa8ff', '#5aa8ff', '#5aa8ff', '#9b8cff', '#9b8cff', '#9b8cff', '#c77dff', '#e060ff', '#e060ff', '#ff5a8a', '#ff5a8a', '#ff7a5a', '#ff7a5a', '#ffb35a', '#ffe08a'];
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
function genNetwork() {
    const rnd = (a => () => {
        a |= 0;
        a = a + 0x6D2B79F5 | 0;
        let t = Math.imul(a ^ a >>> 15, 1 | a);
        t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
        return ((t ^ t >>> 14) >>> 0) / 4294967296;
    })(NET_SEED);
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
    const pickEl = (r, lo, hi) => {
        const f = r / NET_RINGS;
        const top = Math.min(els.length - 2, Math.floor(els.length * Math.pow(f, 1.25) * hi + 4));
        const bot = Math.max(0, Math.floor(top * lo));
        return els[bot + Math.floor(rnd() * Math.max(1, top - bot))][0];
    };
    nodes.forEach(n => {
        const r = n.ring;
        const rr = r * 18 / NET_RINGS;
        if (r === 0) {
            n.req = { t: 'el', k: 'O', n: 1 };
            return;
        }
        const roll = rnd();
        if (r <= 1 || roll < 0.34) {
            n.req = { t: 'el', k: pickEl(r, 0.55, 1), n: 1 };
        } else if (roll < 0.6) {
            const k = pickEl(Math.max(1, r * 0.45), 0, 0.6);
            n.req = { t: 'el', k, n: Math.max(2, Math.round(NET_QTY * 3 * Math.pow(NET_QTY_GROWTH, rr) / Math.pow(ELEMENTS.find(e => e[0] === k)[2], 0.55))) };
        } else if (roll < 0.74 && r >= 2) {
            const ok = fams.filter(f => famMin(f) <= Math.pow(10, 1 + rr * 0.33));
            const f = ok[Math.floor(rnd() * ok.length)];
            n.req = { t: 'fam', k: f, n: Math.max(1, Math.round(NET_FAM_QTY * Math.pow(1.3, rr) / Math.pow(famMin(f), 0.3))) };
        } else if (roll < 0.9 && r >= 3) {
            const span = comps.length;
            const at = Math.min(span - 1, Math.floor(Math.pow((r - 2) / (NET_RINGS - 2), 1.1) * span * (0.6 + rnd() * 0.4)));
            const a = comps[at];
            n.req = { t: 'cp', k: normalizeFormula(a.formula), l: a.formula, nm: a.name, n: 1 };
        } else {
            n.req = { t: 'has', k: pickEl(r, 0.1, 0.55), n: 1 };
        }
    });
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
    // The big rewards (luck multipliers, bonus rolls, chain steps, shop slots) sit behind the
    // hardest grind in their ring: the line leading to that ring's largest quantity slot.
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
    const adj = nodes.map(() => []);
    edges.forEach((e, i) => {
        adj[e.a].push(i);
        adj[e.b].push(i);
    });
    return { nodes, edges, adj };
}
function net() {
    return NET || (NET = genNetwork());
}
const netFilled = id => !!netState[id];
const edgeLit = e => netFilled(e.a) && netFilled(e.b);
function edgeDesc(e) {
    const v = e.val;
    return e.kind === 'luck' ? `+${v}% luck` : e.kind === 'mult' ? `×${v} luck` : e.kind === 'auto' ? `+${v}% autoroll speed` : e.kind === 'chain' ? 'Chain chance +1 step' : e.kind === 'extra' ? '+1 bonus roll' : e.kind === 'price' ? `−${v}% shop prices` : e.kind === 'refresh' ? `−${v} min shop restock` : e.kind === 'stock' ? `+${v}% rarer shop stock` : '+1 shop stock slot';
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
    netState[id] = 1;
    saveNet();
    netVer++;
    buffCache = weightCache = null;
    return true;
}
// totals from every lit line
function bondBonus() {
    const r = {
        add: 0, mult: 1, auto: 0, price: 0, refresh: 0, stock: 0, slots: 0, chain: 0, extra: 0
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
        } else {
            r[e.kind] += e.val;
        }
    });
    return r;
}
function bondSummary() {
    const N = net().nodes.length;
    const f = Object.keys(netState).length;
    $('homeBonds').textContent = f + ' / ' + N + ' slots';
}
// ---- the network view
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
    const { nodes, edges } = net();
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
            const p = e.kind === 'mult' || e.kind === 'slot' || e.kind === 'chain' || far ? solid : dashed;
            p.moveTo(ax, ay);
            p.lineTo(bx, by);
        }
        if (z > 0.8) {
            const relevant = on || netFilled(e.a) || netFilled(e.b) || e.kind === 'mult' || e.kind === 'slot' || e.kind === 'chain';
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
            g.fillStyle = on ? ringCol(e.ring) : (e.kind === 'mult' || e.kind === 'slot' || e.kind === 'chain') ? '#f0c419' : 'rgba(232,239,233,.55)';
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
            if (avail) {
                ring.moveTo(x + rr + 4, y);
                ring.arc(x, y, rr + 4, 0, Math.PI * 2);
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
            const col = ringCol(n.ring);
            anyAvail = anyAvail || avail;
            g.globalAlpha = filled || reach ? 1 : 0.35;
            const hex = n.req.t === 'cp' || n.req.t === 'has';
            slotPath(g, x, y, R, hex);
            g.fillStyle = filled ? col : '#0d1311';
            g.fill();
            g.lineWidth = Math.max(1.2, (filled ? 2.5 : 1.6) * z);
            g.strokeStyle = filled ? col : avail ? '#f0c419' : 'rgba(232,239,233,.4)';
            g.stroke();
            if (avail) {
                g.globalAlpha = 0.3 + 0.5 * pulse;
                slotPath(g, x, y, R + (5 + 5 * pulse) * z, hex);
                g.strokeStyle = '#f0c419';
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
    const key = netVer + ':' + Object.keys(netState).length;
    if (netFarPic && netFarPic.key === key) {
        return netFarPic;
    }
    const { nodes, edges } = net();
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
    const { nodes } = net();
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
    const b = bondBonus();
    const rows = [['Luck', '+' + b.add.toFixed(2) + '%'], ['Luck multiplier', '×' + b.mult.toFixed(3)], ['Autoroll speed', '+' + b.auto.toFixed(1) + '%'], ['Shop prices', '−' + b.price.toFixed(2) + '%'], ['Shop restock', '−' + b.refresh.toFixed(2) + ' min'], ['Rarer shop stock', '+' + b.stock.toFixed(2) + '%'], ['Shop stock slots', '+' + b.slots], ['Bonus rolls', '+' + b.extra], ['Chain steps', '+' + b.chain]];
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
        netView.z = Math.max(0.12, Math.min(2.6, netView.z * f));
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
            netView.z = Math.max(0.12, Math.min(2.6, pinch.z * d / pinch.d));
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
            net().nodes.forEach(n => {
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
// ---------------------------------------------------------------------------
// Catalyst shop. Restocks on fixed real-time boundaries; bought catalysts go to an
// inventory; one active catalyst per tier; the same catalyst extends; timers run
// in real time; single-roll catalysts cover one individual roll each.
// ---------------------------------------------------------------------------
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
    { id: 'stone', name: "Philosopher's Stone", tier: 6, rolls: 1, fx: { unfound: true }, price: 27000 }
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
    return "The roll gives an element you haven't found yet (+3,000% luck if you've found them all)";
}
const catLength = c => c.rolls ? (c.rolls === 1 ? 'Single roll' : `Next ${c.rolls} rolls`) : `Timed, ${c.min} min`;
// ---- saved state
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
function saveCats() {
    try {
        localStorage.setItem('elementalShop', JSON.stringify(shopState));
        localStorage.setItem('elementalCatInv', JSON.stringify(catInv));
        localStorage.setItem('elementalCatActive', JSON.stringify(catActive));
    } catch (e) { }
}
// ---- active catalysts
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
        luck: 0, speed: 0, quark: 0, extra: 0, chain: 0, chainMax: false, fam: {}
    };
    activeList().forEach(({ a, c }) => {
        if (!a.until) {
            return;
        }
        const f = c.fx;
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
        catActive[c.tier] = { id, until: base + c.min * 60000 * n };
    }
    catInv[id] = have - n;
    if (!catInv[id]) {
        delete catInv[id];
    }
    saveCats();
    buffCache = weightCache = null;
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
    const out = { rollLuck: 0, unfound: false, linked: false, used: [] };
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
        if (f.linked) {
            out.linked = true;
        }
        a.rolls -= 1;
    });
    pruneActive();
    saveCats();
    return out;
}
function clearCatalyst(tier) {
    delete catActive[tier];
    saveCats();
    buffCache = weightCache = null;
}
// ---- the shop
function shopPeriodMs() {
    const b = bondBonus();
    return Math.max(5, 20 - b.refresh) * 60000;
}
const shopSlots = () => Math.min(5, 2 + bondBonus().slots);
function shopPrice(c) {
    return Math.max(1, Math.round(c.price * (1 - Math.min(90, bondBonus().price) / 100)));
}
// The shop's clock: the server's time once known (see "While you were away"), so moving
// the device clock forward doesn't restock it. Declared here so the shop can use it early.
var clockBase = null;
var clockTried = false;
function shopNow() {
    return clockBase ? clockBase.server + (performance.now() - clockBase.perf) : Date.now();
}
// The time of the next restock is saved, so a change to the restock time (bonds can
// shorten it) applies from the next restock rather than restocking on the spot.
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
        shopState.stock = [];
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
    const pool = CATALYSTS.filter(c => c.tier === tier);
    return pool[Math.floor(Math.random() * pool.length)].id;
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
    s.sold = true;
    catInv[s.id] = (catInv[s.id] || 0) + 1;
    saveCats();
    renderShop();
    $('shopMsg').textContent = `${c.name} added to your inventory.`;
}
const tierChip = t => `<span class="cat-tier" style="--tc:${CAT_TIERS[t].col}">${CAT_TIERS[t].name}</span>`;
function renderShop() {
    if (!$('shopStock')) {
        return;
    }
    shopCheck();
    $('shopTimer').textContent = fmtClock(shopNextIn() / 1000);
    $('shopStock').innerHTML = shopState.stock.map((s, i) => {
        const c = CAT[s.id];
        const p = shopPrice(c);
        return `<article class="cat-card${s.sold ? ' sold' : ''}" style="--tc:${CAT_TIERS[c.tier].col}">${tierChip(c.tier)}<h3>${c.name}</h3><p>${catEffect(c)}</p><p class="cat-len">${catLength(c)}</p><button class="${s.sold ? 'ghost' : 'primary'} cat-buy" data-i="${i}"${s.sold || quarks < p ? ' disabled' : ''}>${s.sold ? 'Bought' : `<span class="q-sym">q</span> ${p.toLocaleString('en-US')}`}</button></article>`;
    }).join('');
    $('shopSlotsNote').textContent = `${shopState.stock.length} of 5 stock slots open`;
    renderActiveCats();
}
function renderActiveCats() {
    const list = activeList();
    const html = list.length ? list.map(({ tier, a, c }) => `<div class="act-row" style="--tc:${CAT_TIERS[tier].col}">${tierChip(tier)}<strong>${c.name}</strong><span class="act-left" data-tier="${tier}">${catLeft(a)}</span></div>`).join('') : '<p class="muted">No catalysts active.</p>';
    ['catActive', 'rollCats'].forEach(k => {
        const el = $(k);
        if (el) {
            el.innerHTML = list.length ? (k === 'catActive' ? '<div class="inv-sect"><span>Active</span></div>' : '') + html : '';
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
    const b = e.target.closest('.cat-buy');
    if (b) {
        buyStock(+b.dataset.i);
    }
});
// ---- the inventory page: a grid of owned catalysts and a detail panel for the selected one
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
        const status = a && a.id === invSel ? `<p class="ip-status on">Running: ${catLeft(a)} left. Using more adds to it.</p>` : a ? `<p class="ip-status off">${CAT[a.id].name} is running for ${T.name.toLowerCase()} catalysts (${catLeft(a)} left), so this one can't be used until it ends.</p>` : '';
        const n = catInv[invSel];
        d.innerHTML = `<div class="inv-preview" style="--tc:${T.col}"><span class="ip-mark">${catMark(c)}</span><span class="ip-tier">${T.name}</span></div>
<div class="ip-use"><button class="primary" data-use="1">Use</button>${n > 1 ? '<button class="ghost" data-use="pick">Use…</button><button class="ghost" data-use="all">Use all</button>' : ''}</div>
<p class="shop-msg" id="invMsg" aria-live="polite"></p>
<div class="ip-desc" style="--tc:${T.col}"><h2>${c.name}</h2>${tierChip(c.tier)}<p class="ip-effect">${catEffect(c)}</p><dl class="stats"><div><dt>Lasts</dt><dd>${catLength(c)}</dd></div><div><dt>You have</dt><dd>×${n.toLocaleString('en-US')}</dd></div>${c.rolls ? '' : `<div><dt>Using all</dt><dd>${fmtClock(c.min * 60 * n)}</dd></div>`}</dl>${status}</div>`;
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
        found, luck: (luck + bd.add) * bd.mult + cb.luck, speed: speed + cb.speed, autoUnlocked: autoUnlock, autoSpeed: autoSpeed + bd.auto, autoGap: Math.max(AUTO_MIN_GAP, AUTO_BASE_GAP / (1 + (autoSpeed + bd.auto) / 100)), extra: Math.min(3, extra + bd.extra + cb.extra), chainSteps: Math.min(8, chainSteps), chainDenom: cb.chainMax ? 3 : Math.max(3, denom - cb.chain), fam: cb.fam, quark: cb.quark, exp: catNextExpiry()
    };
}
function weightTable(extraLuck, only) {
    const b = activeBuffStats();
    if (!extraLuck && !only && weightCache && weightCache.b === b) {
        return weightCache;
    }
    const luck = b.luck + (extraLuck || 0);
    let total = 0;
    const w = ELEMENTS.map(e => {
        if (only && !only(e)) {
            return 0;
        }
        const v = (1 / e[2]) * Math.pow(1 + 1.5 * (Math.log10(e[2] + 1) / 3), (luck / 100) / 1.5) * (1 + (b.fam[familyOf(e[0])] || 0) / 100);
        total += v;
        return v;
    });
    const t = { w, total, b };
    if (!extraLuck && !only) {
        weightCache = t;
    }
    return t;
}
// one element, with the active buffs; `extraLuck` and `only` come from single-roll catalysts
function weightedElement(extraLuck, only) {
    const { w, total } = weightTable(extraLuck, only);
    let r = Math.random() * total;
    for (let i = 0; i < ELEMENTS.length; i++) {
        r -= w[i];
        if (r <= 0) {
            return ELEMENTS[i];
        }
    }
    return ELEMENTS[ELEMENTS.length - 1];
}
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
const SYM_IDX = Object.fromEntries(ELEMENTS.map((e, i) => [e[0], i]));
// Odds are always base odds: no luck, chain or other buffs are counted.
// Shown odds = element 1 base odds x 8 x element 2 base odds x 8 x ... using each
// element's listed base odds and the base chain chance of 1 in 8.
function exactRarity(elements, guaranteedExtras = 0) {
    const n = Math.max(1, elements.length - guaranteedExtras);
    let log10 = -(n - 1) * Math.log10(BASE_CHAIN);
    elements.forEach(e => log10 -= Math.log10(ELEMENTS[SYM_IDX[e[0]]][2]));
    return log10;
}
function rarityText(log) {
    const value = 10 ** (-log);
    if (Number.isFinite(value) && value < 1e21) {
        return '1/' + Math.max(1, Math.round(value)).toLocaleString('en-US', { maximumFractionDigits: 0 });
    }
    return '≈ 1/' + value.toExponential(2).replace('+', '');
}
// Quarks earned by one roll. Everyday rolls (score up to 10,000) earn √score × 0.1.
// Above that the curve steepens (score^0.75), so rare finds feel like a reward:
// Flerovium about 345, Uranium about 2,000. Even with a quark catalyst, no single roll
// pays enough for a legendary catalyst, so one lucky roll can't buy out the shop.
const QUARK_RATE = 0.1;
const QUARK_KNEE = 10000;
function quarksFor(score, mult) {
    const base = score <= QUARK_KNEE ? Math.sqrt(score) : Math.pow(score, 0.75) / Math.pow(QUARK_KNEE, 0.25);
    return base * QUARK_RATE * mult;
}
// Score = the base odds of every element in the roll added together.
function rollScore(elements) {
    return elements.reduce((sum, e) => sum + ELEMENTS[SYM_IDX[e[0]]][2], 0);
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
const APP_VERSION = '1.5';
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
// ---- Quark Storm. After any press of Roll there's a 1 in 8,000 chance of a storm, which
// lasts the next 100 presses. While it lasts, every roll earns 2 to 30 extra quarks on top
// of its usual quarks (quark catalysts don't multiply these). A storm can't start while one
// is already running. Away rolls count too.
const QSTORM_CHANCE = 1 / 8000;
const QSTORM_PRESSES = 100;
const QSTORM_MIN = 2;
const QSTORM_MAX = 30;
let qStorm = null;
try {
    const v = JSON.parse(localStorage.getItem('elementalQStorm') || 'null');
    qStorm = v && v.left > 0 ? { left: Math.min(QSTORM_PRESSES, Math.floor(v.left)), got: +v.got || 0 } : null;
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
// One press of Roll with `count` rolls. Returns { add: storm quarks for each roll, sum, ended }
// while a storm runs, { started: true } when this press starts one, otherwise null.
function qStormPress(count) {
    if (qStormOn()) {
        const add = Array.from({ length: count }, () => QSTORM_MIN + Math.floor(Math.random() * (QSTORM_MAX - QSTORM_MIN + 1)));
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
    if (Math.random() < QSTORM_CHANCE) {
        qStorm = { left: QSTORM_PRESSES, got: 0 };
        qStormSave();
        return { started: true };
    }
    return null;
}
function renderQStorm(last) {
    const bar = $('qStormBar');
    if (!bar) {
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
    rollHistory.unshift({ n, f: rec.formula, l: rec.log, s: rec.score });
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
    el.innerHTML = rollHistory.map(h => `<div class="history-row"><span class="h-num">#${h.n.toLocaleString('en-US')}</span><span class="h-formula" title="${h.f}">${h.f}</span><span class="h-val">${displayMode === 'score' ? 'Score ' + fmtScore(h.s) : rarityText(h.l)}</span></div>`).join('');
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
    return FAMILY[sym] || 'transition';
}
function buildTable(root, mode) {
    if (!root) {
        return;
    }
    root.innerHTML = '';
    const found = discoveredSymbols();
    ELEMENTS.forEach((e, i) => {
        const pos = tableLayout[e[0]] || [11, 1];
        const isFound = found.has(e[0]);
        const tile = document.createElement('button');
        tile.type = 'button';
        tile.className = 'element-tile' + (isFound ? ' discovered fam-' + familyOf(e[0]) : '') + '';
        tile.style.gridRow = pos[0];
        tile.style.gridColumn = pos[1];
        tile.title = isFound ? `${e[1]}, ${FAMILY_NAMES[familyOf(e[0])]}` : (mode === 'full' ? 'Not found yet. Select to see its bonus.' : 'Not found yet');
        tile.setAttribute('aria-label', `${e[1]}${isFound ? ', found' : ', not found yet'}`);
        tile.innerHTML = mode === 'full'
            ? `<span class="atomic">${isFound ? i + 1 : ''}</span><span class="sym">${isFound ? e[0] : ''}</span><span class="tiny">${isFound ? e[1] : ''}</span>`
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
    const e = ELEMENTS.find(x => x[0] === selectedElementSymbol) || ELEMENTS[0];
    const b = ELEMENT_BUFFS.get(e[0]);
    const isFound = found.has(e[0]);
    $('buffElementName').textContent = `${e[1]} (${e[0]})`;
    $('buffElementDesc').textContent = b.desc;
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
    el.innerHTML = `<div class="rank-num">${rank}</div><div class="rank-main"><div class="rank-formula">${c.formula}</div><div class="rank-name">${c.name}${c.elements.length > 1 && c.name !== joined ? ': ' + joined : ''}</div></div><div class="rank-odds"><b>${mode === 'score' ? 'Score ' + rarityShown(r, 'score') : rarityShown(r, 'odds')}</b><span>× ${c.count.toLocaleString()}</span></div>`;
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
// shrink an element's font so `text` fits in `room` pixels
function fitText(el, text, room, base) {
    const cs = getComputedStyle(el);
    const b = base || parseFloat(cs.fontSize) || 80;
    const m = fitText.c || (fitText.c = document.createElement('canvas').getContext('2d'));
    m.font = cs.fontWeight + ' ' + b + 'px ' + cs.fontFamily;
    const w = m.measureText(text).width;
    el.style.fontSize = (w > room ? Math.max(9, b * room / w) : b) + 'px';
}
const MR_TIER_COL = ['rgba(232,239,233,.35)', '#7cc8ff', '#5eead4', '#b39dff', '#f78fd8', '#ffd166', '#ff9a5c', '#ff5d7a', '#c9b8ff', '#fff6d6'];
// multiroll: show one roll large with its details; the strip picks which
function showMultiRoll(col, records, i, best, swap) {
    const r = records[i];
    const main = col.querySelector('.mr-main');
    const card = col.querySelector('.result-card');
    const reel = col.querySelector('.reel');
    if (swap && main.textContent !== r.formula) {
        main.classList.remove('swap');
        void main.offsetWidth;
        main.classList.add('swap');
    }
    main.textContent = r.formula;
    fitText(main, r.formula, reel.clientWidth - 48, parseFloat(getComputedStyle(reel).getPropertyValue('--mr-fs')) || undefined);
    col.querySelectorAll('.mr-chip').forEach((c, k) => c.classList.toggle('sel', k === i));
    card.querySelector('.eyebrow').textContent = `Roll ${i + 1} of ${records.length}` + (i === best ? ' · best' : '');
    card.querySelector('.result-name').textContent = r.name;
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
    try {
        const onRoll = $('game').classList.contains('active');
        if (onRoll) {
            startRollTicks();
        }
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
            const elements = [first || weightedElement(luckUp)];
            while (elements.length < 30 && ((ch.linked && elements.length === 1) || Math.random() < 1 / buffs.chainDenom)) {
                elements.push(weightedElement(luckUp));
            }
            const formula = hillFormula(elements);
            const log = exactRarity(elements, 0);
            return {
                elements, formula, log, rarity: rarityText(log), score: rollScore(elements), cats: timed.concat(ch.used)
            };
        });
        const stormFx = !pre && qStormOn();
        const storm = pre ? null : qStormPress(rolls.length);
        const bestIdx = rolls.reduce((bi, r, i) => r.score > rolls[bi].score ? i : bi, 0);
        const secret = !replay && getRarityTier(rolls[bestIdx].score) >= 5 && Math.random() < SECRET_CHANCE;
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
            fitText(syms[0], rolls[feat].formula, reel.clientWidth - 48);
            chips.forEach((c, i) => fitText(c.querySelector('b'), rolls[i].formula, c.clientWidth - 10, 18));
            const rr = reel.getBoundingClientRect();
            const mid = el => {
                const q = el.getBoundingClientRect();
                return { x: q.left + q.width / 2 - rr.left, y: q.top + q.height / 2 - rr.top, fs: parseFloat(el.style.fontSize) };
            };
            targets = rolls.map((r, i) => mid(i === feat ? syms[0] : chips[i].querySelector('b')));
        }
        if (cut) {
            stopRollTicks();
            await playCutscene(cut.sym, reel, multi ? [rolls[feat].formula] : rolls.map(r => r.formula), multi ? 0 : cut.idx, syms);
        } else {
            playBuildup(onRoll ? Math.max(...rolls.map(r => getRarityTier(r.score))) : 0, (Math.max(120, 1350 * delay / 3000) + 1650) / 1000);
            await scanField(reel, syms, rolls.map(r => r.formula), rolls.map(r => r.score), delay, targets, stormFx);
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
            records.push(record);
            if (!pre) {
                addRecord(record);
                addHistory(record, totalRolls());
                save();
                checkAchievements(record);
                globalConsider(record);
            }
            if (multi) {
                const c = chips[i];
                c.querySelector('b').textContent = formula;
                c.querySelector('span').textContent = rarityShown(record);
                c.style.setProperty('--tc', MR_TIER_COL[getRarityTier(score)]);
                c.classList.toggle('feat', i === feat);
                c.classList.toggle('best', i === bestIdx);
            } else {
                syms[i].textContent = formula;
                card.querySelector('.result-name').textContent = name;
                card.querySelector('.rarity').textContent = rarityWord() + ' ' + rarityShown(record);
                card.querySelector('.sub').textContent = $('chainSetting').value === 'off' ? '' : elements.length > 1 ? `${elements.length} elements chained` : 'No chain';
            }
            if (onRoll || cut || getRarityTier(score) > 0) {
                playResultChime(score, secret && i === bestIdx);
            }
            if (!pre) {
                addQuarks(quarksFor(score, 1 + (buffs.quark || 0) / 100) + (storm && storm.add ? storm.add[i] : 0));
            }
        });
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
        if (storm) {
            renderQStorm(storm.sum);
            if (storm.started) {
                showAchievementToast({ kicker: 'Event', name: 'Quark Storm', flavor: 'For the next ' + QSTORM_PRESSES + ' rolls, every roll earns ' + QSTORM_MIN + ' to ' + QSTORM_MAX + ' extra quarks.' });
            } else if (storm.ended) {
                showAchievementToast({ kicker: 'Quark Storm over', name: '+' + formatNumber(Math.round(storm.ended)) + ' quarks', flavor: 'The storm has passed. That is what it added on top of your usual quarks.' });
            }
        }
        renderInventory();
        renderPeriodic();
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
// ---- autoroll: once unlocked it stays on until switched off, with a break between rolls.
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
            localStorage.removeItem('elementalNetwork');
            localStorage.removeItem('elementalShop');
            localStorage.removeItem('elementalCatInv');
            localStorage.removeItem('elementalCatActive');
            shopState = { slot: -1, stock: [] };
            catInv = {};
            catActive = {};
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
// Rarity labels come from the estimated number of rolls needed to land each formula,
// assuming 150% luck and a 1 in 3 chain chance.
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
    drawText(ctx, 'ELEMENT ' + scene.atomicNumber, W / 2, H / 2 - 24 * u, 2.2 * u, color, a * 0.85, 600, 0.6 * u);
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
// ---------------------------------------------------------------------------
// Storage: how much of the browser's space the save uses, and clearing finds
// that are no longer needed. Rolls from cleared finds still count in the roll total.
// ---------------------------------------------------------------------------
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
// Which finds go: everything scoring below the minimum, except
//  · single elements (they fill element and family bonds, and keep elements found)
//  · achievement formulas (they fill compound bonds)
//  · your top 10 by odds and top 10 by score
//  · enough compounds containing each element to fill every unfilled "compound with X" bond
//  · at least one find for every element you've found
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
// ---------------------------------------------------------------------------
// Cutscene and effect viewer (Settings): replay any cutscene or rarity effect you've
// seen. Secret effects stay completely hidden here until you've seen one.
// ---------------------------------------------------------------------------
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
        // first time: cutscenes for elements already found (they play every time),
        // and the normal effect of every tier already reached. Secret effects can't be known.
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
const VIEW_ORDER = () => Object.keys(CUTSCENES).sort((a, b) => CUTSCENES[b].z - CUTSCENES[a].z === 0 ? 0 : elementBySymbol[b][2] - elementBySymbol[a][2]);
function renderViewer() {
    const s = seenLoad();
    const cuts = $('vwCuts');
    cuts.innerHTML = VIEW_ORDER().map(sym => s.cut.includes(sym) ?
        '<button class="vw-tile" data-cut="' + sym + '"><b>' + sym + '</b><span>' + esc(elementBySymbol[sym][1]) + '</span></button>' :
        '<button class="vw-tile locked" disabled><b>?</b><span>Not seen yet</span></button>').join('');
    $('vwFx').innerHTML = TIER_SCORES.map((_, i) => i + 1).map(t => s.fx.includes(t) ?
        '<button class="vw-tile" data-fx="' + t + '" style="--tc:' + RARITY_FX[t].c + '"><b>' + t + '</b><span>Tier ' + t + '</span></button>' :
        '<button class="vw-tile locked" disabled><b>?</b><span>Tier ' + t + '</span></button>').join('');
    const dark = s.dark.filter(t => RARITY_DARK[t]).sort((a, b) => a - b);
    $('vwDarkWrap').hidden = !dark.length;
    $('vwDark').innerHTML = dark.map(t => '<button class="vw-tile dark" data-dark="' + t + '" style="--tc:' + RARITY_DARK[t].c + '"><b>' + t + '</b><span>Secret tier ' + t + '</span></button>').join('');
    $('vwCount').textContent = s.cut.length + ' of ' + Object.keys(CUTSCENES).length + ' cutscenes and ' + s.fx.length + ' of ' + TIER_SCORES.length + ' effects seen.';
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
['vwCuts', 'vwFx', 'vwDark'].forEach(id => $(id).addEventListener('click', e => {
    const b = e.target.closest('button[data-cut], button[data-fx], button[data-dark]');
    if (b) {
        viewerPlay(b);
    }
}));
// Donation links stay out of app-store versions (an Android app's built-in browser,
// or a page opened with ?app=play), where store rules don't allow outside payments.
if (/[?&]app=play\b/.test(location.search) || /; wv\)/.test(navigator.userAgent)) {
    document.querySelectorAll('.donate-only').forEach(e => e.remove());
}
// ---------------------------------------------------------------------------
// Accounts and cloud saves (Supabase). Signing in is optional: signed out, or
// offline, the game runs exactly as before from this device's own storage.
// Only progress is synced; display settings stay per device.
// ---------------------------------------------------------------------------
const CLOUD = {
    enabled: true,
    url: 'https://svfscvtskwuaygjgszog.supabase.co',
    key: 'sb_publishable_TF1DqFy8EPLwXOuZjPv_CQ_jgk2_oYf',
    lib: 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.112.4/dist/umd/supabase.js'
};
const CLOUD_KEYS = ['elementalCollection', 'elementalCleared', 'elementalSeen', 'elementalAchievements', 'elementalQuarks', 'elementalHistory', 'elementalNetwork', 'elementalShop', 'elementalCatInv', 'elementalCatActive'];
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
    // Supabase reports the starting session first, then any sign-in or sign-out.
    // Work is deferred so it never runs inside the auth callback itself.
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
    // ask only when the cloud save last changed (a few bytes); the save itself is
    // downloaded only when another device has changed it
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
// Sends this device's progress up. Unless forced, it only overwrites the cloud
// save this device last saw, so two devices never silently undo each other.
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
// ---- dialogs (name choice and save conflict)
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
// ---- the Account section in Settings
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
        html = '<p>Signed in as <b>' + esc(cloudName || 'no name yet') + '</b> · ' + esc(cloudUser.email || '') + '</p>' +
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
// ---------------------------------------------------------------------------
// Global top 10 and globals. The game only sends a roll's formula; the server
// works out its odds and score itself. A roll is sent when it would make the
// board, or when its tier counts as a global (set from the admin tab).
// ---------------------------------------------------------------------------
let globalBoard = { odds: null, score: null, at: 0, error: false };
let globalSettings = { min_tier: 7, announce_top10: true, discord_enabled: true, banner_enabled: true };
let globalMode = 'odds';
let globalLoading = false;
const globalSent = new Set();
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
    const [a, b, s] = await Promise.all([
        sb.from('global_top_odds').select('id, formula, odds_log, score, found_at, display_name'),
        sb.from('global_top_score').select('id, formula, odds_log, score, found_at, display_name'),
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
    const onBoard = list => list.some(r => r.formula === rec.formula && r.display_name === cloudName);
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
    if (!isGlobal && (globalSent.has(rec.formula) || !globalBeats(rec))) {
        return;
    }
    globalSent.add(rec.formula);
    const st = activeBuffStats();
    globalSubmit({
        f: rec.formula,
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
    const { data, error } = await sb.rpc('submit_roll', {
        p_formula: p.f, p_label: p.label, p_rolls: p.rolls, p_luck: p.luck, p_catalysts: p.cats, p_old: p.old
    });
    if (error || !data) {
        globalSent.delete(p.f);
        globalQueue(p);
        return;
    }
    globalSetPending(globalPending().filter(x => !(x.f === p.f && x.old === p.old)));
    if (data.ok && data.added) {
        const parts = [];
        if (data.rank_odds <= 10) {
            parts.push('#' + data.rank_odds + ' by odds');
        }
        if (data.rank_score <= 10) {
            parts.push('#' + data.rank_score + ' by score');
        }
        showAchievementToast({ kicker: 'Global top 10', name: p.f + ' · ' + globalName(p.f), flavor: 'You are now ' + parts.join(' and ') + ' in the world.' });
        globalLoad();
    }
}
function globalQueue(p) {
    const list = globalPending();
    if (!list.some(x => x.f === p.f && x.old === p.old)) {
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
// After signing in: your best finds so far get a chance at the board too.
// They're marked as old, so they aren't announced as new finds.
// Runs once per account on each device, so later rolls (like the ones made while
// away) are never sent this way: only rolls as they happen, or an away session's rarest.
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
    el.innerHTML = '<div class="rank-num">' + rank + '</div><div class="rank-main"><div class="rank-formula">' + esc(r.formula) + '</div>' +
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
// ---- the banner: other players' globals, live. The connection is only open while
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
function bannerAdd(a) {
    if (!a || !globalSettings.banner_enabled || (cloudName && a.display_name === cloudName)) {
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
    const fx = RARITY_FX[Math.min(9, a.tier)];
    el.style.setProperty('--bc', fx ? fx.c : 'var(--hazard)');
    el.innerHTML = '<b>' + esc(a.display_name) + '</b> has found <b>' + esc(a.label || globalName(a.formula)) + '</b><span>' +
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
// ---- gifts from the admin, handed over when you sign in or come back to the game
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
// ---------------------------------------------------------------------------
// Admin tab: only shown to the admin account. Every action is checked again by
// the server, so the tab being visible gives nobody else any power.
// ---------------------------------------------------------------------------
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
        sel.add(new Option('No tier: only new global top 10 entries', 10));
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
        el.innerHTML = '<div><b>' + esc(g.formula) + '</b> · ' + esc(g.display_name) + (g.removed ? ' <span class="adm-tag">Removed</span>' : '') +
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
// ---------------------------------------------------------------------------
// While you were away: when the game is opened again after being closed, it rolls
// for the time away as if autoroll had been running ten times slower, up to 24 hours.
// Every roll is added to the collection (so it counts for bonds, achievements, the
// roll total and quarks), but only the rarest is shown, played and announced.
// ---------------------------------------------------------------------------
const AWAY_MAX = 24 * 3600;
const AWAY_SLOWER = 10;
// Time away is measured with the server's clock, carried forward by the browser's own
// timer, which changing the device clock doesn't affect. So a device clock that's
// wrong, or moved forward on purpose, makes no difference.
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
function awayMakeRoll(b) {
    const elements = [weightedElement(0)];
    while (elements.length < 30 && Math.random() < 1 / b.chainDenom) {
        elements.push(weightedElement(0));
    }
    const formula = hillFormula(elements);
    const log = exactRarity(elements, 0);
    const known = ACHIEVEMENTS.find(a => a.hill === formula);
    const name = elements.length === 1 ? elements[0][1] : (known ? known.name : elements.map(e => e[1]).join(' + '));
    return { elements, formula, name, log, rarity: rarityText(log), score: rollScore(elements) };
}
function fmtClock(s) {
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
    const seconds = Math.min(AWAY_MAX, Math.max(0, (trustedNow() - since) / 1000));
    const n = awayRollsFor(seconds);
    if (n < 1) {
        return;
    }
    const b = activeBuffStats();
    const index = new Map(collection.map(c => [c.formula, c]));
    const mult = 1 + (b.quark || 0) / 100;
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
    for (let i = 0; i < n; i++) {
        if (i % per === 0) {
            const sp = qStormPress(Math.min(per, n - i));
            stormAdd = sp && sp.add;
            stormStarted = stormStarted || !!(sp && sp.started);
        }
        if (stormAdd) {
            earned += stormAdd[i % per];
            stormQ += stormAdd[i % per];
        }
        const r = awayMakeRoll(b);
        if (!best || (displayMode === 'score' ? r.score > best.score : r.log < best.log)) {
            best = r;
        }
        let x = index.get(r.formula);
        if (!x) {
            x = { formula: r.formula, name: r.name, elements: r.elements, rarity: r.rarity, log: r.log, score: r.score, count: 0 };
            collection.push(x);
            index.set(r.formula, x);
            firstFinds.push(x);
        }
        x.count++;
        total++;
        earned += quarksFor(r.score, mult);
        if (n - i <= HISTORY_MAX) {
            hist.push({ n: total, f: r.formula, l: r.log, s: r.score });
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
        '<p class="away-clock">' + fmtClock(seconds) + ' / 24:00:00</p>' +
        '<dl class="away-best"><dt>Your rarest find was</dt><dd>' + esc(best.name) + ' <span>' + esc(best.formula) + '</span></dd>' +
        '<dt>With ' + (displayMode === 'score' ? 'a score' : 'odds') + ' of</dt><dd>' + (displayMode === 'score' ? fmtScore(best.score) : rarityText(best.log)) + '</dd></dl>' +
        (stormQ || stormStarted ? '<p class="away-storm"><b>Quark Storm</b> ' + (stormStarted || !stormWas ? 'hit while you were away' : qStormOn() ? 'carried on while you were away' : 'blew itself out while you were away') +
            (stormQ ? ': +' + formatNumber(stormQ) + ' quarks' : '') + '.' + (qStormOn() ? ' It is still going, with ' + qStorm.left + ' rolls left.' : '') + '</p>' : '') +
        '<div class="btn-row"><button class="primary" id="awayOk">Nice</button></div>');
    w.querySelector('#awayOk').onclick = closeDialog;
}
cloudInit();
awayProcess();
