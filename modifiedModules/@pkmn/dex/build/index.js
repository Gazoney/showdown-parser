"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Dex = exports.ModdedDex = exports.Type = exports.Learnset = exports.Species = exports.Move = exports.Item = exports.Ability = exports.PureEffect = exports.BasicEffect = exports.toID = void 0;
const AbilitiesJSON = __importStar(require("./data/abilities.json"));
const AliasesJSON = __importStar(require("./data/aliases.json"));
const ItemsJSON = __importStar(require("./data/items.json"));
const MovesJSON = __importStar(require("./data/moves.json"));
const SpeciesJSON = __importStar(require("./data/species.json"));
const TypesJSON = __importStar(require("./data/types.json"));
const FormatsDataJSON = __importStar(require("./data/formats-data.json"));
function toID(text) {
    if (text === null || text === void 0 ? void 0 : text.id)
        text = text.id;
    if (typeof text !== 'string' && typeof text !== 'number')
        return '';
    return ('' + text).toLowerCase().replace(/[^a-z0-9]+/g, '');
}
exports.toID = toID;
function getString(str) {
    return (typeof str === 'string' || typeof str === 'number') ? '' + str : '';
}
function combine(obj, ...data) {
    for (const d of data) {
        if (d)
            Object.assign(obj, d);
    }
    return obj;
}
class BasicEffect {
    constructor(data, ...moreData) {
        this.exists = true;
        data = combine(this, data, ...moreData);
        this.name = getString(data.name).trim();
        this.id = data.realMove ? toID(data.realMove) : toID(this.name); // Hidden Power hack
        this.fullname = getString(data.fullname) || this.name;
        this.effectType = getString(data.effectType) || 'Effect';
        this.kind = 'Effect';
        this.exists = !!(this.exists && this.id);
        this.num = data.num || 0;
        this.gen = data.gen || 0;
        this.shortDesc = data.shortDesc || '';
        this.desc = data.desc || '';
        this.isNonstandard = data.isNonstandard || null;
        this.duration = data.duration;
    }
    toString() {
        return this.name;
    }
}
exports.BasicEffect = BasicEffect;
class PureEffect extends BasicEffect {
    constructor(data, ...moreData) {
        super(data, ...moreData);
        data = this;
        this.effectType =
            (['Weather', 'Status'].includes(data.effectType) ? data.effectType : 'Effect');
        this.kind = 'Effect';
    }
}
exports.PureEffect = PureEffect;
class Ability extends BasicEffect {
    constructor(data, ...moreData) {
        super(data, ...moreData);
        data = this;
        this.fullname = `ability: ${this.name}`;
        this.effectType = 'Ability';
        this.kind = 'Ability';
        if (!this.gen) {
            if (this.num >= 234) {
                this.gen = 8;
            }
            else if (this.num >= 192) {
                this.gen = 7;
            }
            else if (this.num >= 165) {
                this.gen = 6;
            }
            else if (this.num >= 124) {
                this.gen = 5;
            }
            else if (this.num >= 77) {
                this.gen = 4;
            }
            else if (this.num >= 1) {
                this.gen = 3;
            }
        }
    }
}
exports.Ability = Ability;
class Item extends BasicEffect {
    constructor(data, ...moreData) {
        super(data, ...moreData);
        data = this;
        this.fullname = `item: ${this.name}`;
        this.effectType = 'Item';
        this.kind = 'Item';
        if (!this.gen) {
            if (this.num >= 689) {
                this.gen = 7;
            }
            else if (this.num >= 577) {
                this.gen = 6;
            }
            else if (this.num >= 537) {
                this.gen = 5;
            }
            else if (this.num >= 377) {
                this.gen = 4;
            }
            else {
                this.gen = 3;
            }
            // Due to difference in gen 2 item numbering, gen 2 items must be
            // specified manually
        }
        if (this.isBerry)
            this.fling = { basePower: 10 };
        if (this.id.endsWith('plate'))
            this.fling = { basePower: 90 };
        if (this.onDrive)
            this.fling = { basePower: 70 };
        if (this.megaStone)
            this.fling = { basePower: 80 };
        if (this.onMemory)
            this.fling = { basePower: 50 };
    }
}
exports.Item = Item;
class Move extends BasicEffect {
    constructor(data, ...moreData) {
        super(data, ...moreData);
        data = this;
        this.fullname = `move: ${this.name}`;
        this.effectType = 'Move';
        this.kind = 'Move';
        this.type = getString(data.type);
        this.basePower = Number(data.basePower);
        this.critRatio = Number(data.critRatio) || 1;
        this.secondary = data.secondary || null;
        this.secondaries = data.secondaries && data.secondaries.length
            ? data.secondaries : this.secondary
            ? [this.secondary]
            : null;
        this.priority = Number(data.priority) || 0;
        this.ignoreImmunity =
            (data.ignoreImmunity !== undefined ? data.ignoreImmunity : data.category === 'Status');
        this.pp = Number(data.pp);
        this.isZ = data.isZ || false;
        this.isMax = data.isMax || false;
        this.flags = data.flags || {};
        this.selfSwitch =
            (typeof data.selfSwitch === 'string'
                ? data.selfSwitch
                : data.selfSwitch) ||
                undefined;
        this.pressureTarget = data.pressureTarget || undefined;
        this.nonGhostTarget = data.nonGhostTarget || undefined;
        this.ignoreAbility = data.ignoreAbility || false;
        this.volatileStatus =
            typeof data.volatileStatus === 'string' ? data.volatileStatus : undefined;
        if (this.category !== 'Status' && !this.maxMove && this.id !== 'struggle') {
            this.maxMove = { basePower: 1 };
            if (this.isMax || this.isZ) {
                // already initialized to 1
            }
            else if (!this.basePower) {
                this.maxMove.basePower = 100;
            }
            else if (['Fighting', 'Poison'].includes(this.type)) {
                if (this.basePower >= 150) {
                    this.maxMove.basePower = 100;
                }
                else if (this.basePower >= 110) {
                    this.maxMove.basePower = 95;
                }
                else if (this.basePower >= 75) {
                    this.maxMove.basePower = 90;
                }
                else if (this.basePower >= 65) {
                    this.maxMove.basePower = 85;
                }
                else if (this.basePower >= 55) {
                    this.maxMove.basePower = 80;
                }
                else if (this.basePower >= 45) {
                    this.maxMove.basePower = 75;
                }
                else {
                    this.maxMove.basePower = 70;
                }
            }
            else {
                if (this.basePower >= 150) {
                    this.maxMove.basePower = 150;
                }
                else if (this.basePower >= 110) {
                    this.maxMove.basePower = 140;
                }
                else if (this.basePower >= 75) {
                    this.maxMove.basePower = 130;
                }
                else if (this.basePower >= 65) {
                    this.maxMove.basePower = 120;
                }
                else if (this.basePower >= 55) {
                    this.maxMove.basePower = 110;
                }
                else if (this.basePower >= 45) {
                    this.maxMove.basePower = 100;
                }
                else {
                    this.maxMove.basePower = 90;
                }
            }
        }
        if (this.category !== 'Status' && !this.zMove &&
            !this.isZ && !this.isMax && this.id !== 'struggle') {
            let basePower = this.basePower;
            this.zMove = {};
            if (Array.isArray(this.multihit))
                basePower *= 3;
            if (!basePower) {
                this.zMove.basePower = 100;
            }
            else if (basePower >= 140) {
                this.zMove.basePower = 200;
            }
            else if (basePower >= 130) {
                this.zMove.basePower = 195;
            }
            else if (basePower >= 120) {
                this.zMove.basePower = 190;
            }
            else if (basePower >= 110) {
                this.zMove.basePower = 185;
            }
            else if (basePower >= 100) {
                this.zMove.basePower = 180;
            }
            else if (basePower >= 90) {
                this.zMove.basePower = 175;
            }
            else if (basePower >= 80) {
                this.zMove.basePower = 160;
            }
            else if (basePower >= 70) {
                this.zMove.basePower = 140;
            }
            else if (basePower >= 60) {
                this.zMove.basePower = 120;
            }
            else {
                this.zMove.basePower = 100;
            }
        }
        if (!this.gen) {
            if (this.num >= 743) {
                this.gen = 8;
            }
            else if (this.num >= 622) {
                this.gen = 7;
            }
            else if (this.num >= 560) {
                this.gen = 6;
            }
            else if (this.num >= 468) {
                this.gen = 5;
            }
            else if (this.num >= 355) {
                this.gen = 4;
            }
            else if (this.num >= 252) {
                this.gen = 3;
            }
            else if (this.num >= 166) {
                this.gen = 2;
            }
            else if (this.num >= 1) {
                this.gen = 1;
            }
        }
    }
}
exports.Move = Move;
class Species extends BasicEffect {
    constructor(data, ...moreData) {
        var _a;
        super(data, ...moreData);
        data = this;
        this.fullname = `pokemon: ${data.name}`;
        this.effectType = 'Pokemon';
        this.kind = 'Species';
        this.baseSpecies = data.baseSpecies || data.name;
        this.forme = data.forme || '';
        this.baseForme = data.baseForme || '';
        this.abilities = data.abilities || { 0: '' };
        this.types = data.types || ['???'];
        this.prevo = data.prevo || '';
        this.tier = data.tier || '';
        this.doublesTier = data.doublesTier || '';
        this.evos = data.evos || [];
        this.nfe = !!((_a = this.evos) === null || _a === void 0 ? void 0 : _a.length);
        this.eggGroups = data.eggGroups || [];
        this.genderRatio = data.genderRatio || (this.gender === 'M' ? { M: 1, F: 0 }
            : this.gender === 'F' ? { M: 0, F: 1 }
                : this.gender === 'N' ? { M: 0, F: 0 }
                    : { M: 0.5, F: 0.5 });
        this.requiredItem = data.requiredItem || undefined;
        this.requiredItems =
            this.requiredItems || (this.requiredItem ? [this.requiredItem] : undefined);
        this.baseStats = data.baseStats || { hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0 };
        this.weightkg = data.weightkg || 0;
        this.weighthg = this.weightkg * 10;
        this.heightm = data.heightm || 0;
        this.unreleasedHidden = data.unreleasedHidden || false;
        this.maleOnlyHidden = !!data.maleOnlyHidden;
        this.maxHP = data.maxHP || undefined;
        this.isMega = !!(this.forme && ['Mega', 'Mega-X', 'Mega-Y'].includes(this.forme)) || undefined;
        this.isGigantamax = data.isGigantamax || undefined;
        this.battleOnly =
            data.battleOnly || (this.isMega || this.isGigantamax ? this.baseSpecies : undefined);
        this.changesFrom = data.changesFrom || (!this.isGigantamax
            ? undefined : this.battleOnly !== this.baseSpecies
            ? this.battleOnly : this.baseSpecies);
        if (!this.gen && data.num >= 1) {
            if (data.num >= 810 || ['Gmax', 'Galar', 'Galar-Zen'].includes(this.forme)) {
                this.gen = 8;
            }
            else if (data.num >= 722 || this.forme.startsWith('Alola') || this.forme === 'Starter') {
                this.gen = 7;
            }
            else if (this.forme === 'Primal') {
                this.gen = 6;
                this.isPrimal = true;
                this.battleOnly = this.baseSpecies;
            }
            else if (data.num >= 650 || this.isMega) {
                this.gen = 6;
            }
            else if (data.num >= 494) {
                this.gen = 5;
            }
            else if (data.num >= 387) {
                this.gen = 4;
            }
            else if (data.num >= 252) {
                this.gen = 3;
            }
            else if (data.num >= 152) {
                this.gen = 2;
            }
            else {
                this.gen = 1;
            }
        }
    }
}
exports.Species = Species;
class Learnset {
    constructor(data) {
        var _a;
        this.effectType = 'Learnset';
        this.kind = 'Learnset';
        this.learnset = data.learnset || undefined;
        this.eventOnly = !!data.eventOnly;
        this.eventData = data.eventData || undefined;
        this.encounters = data.encounters || undefined;
        this.exists = (_a = data.exists) !== null && _a !== void 0 ? _a : true;
    }
}
exports.Learnset = Learnset;
class Type {
    constructor(data, ...moreData) {
        this.exists = true;
        data = combine(this, data, ...moreData);
        this.effectType = 'Type';
        this.kind = 'Type';
        this.id = data.id || '';
        this.name = getString(data.name).trim();
        this.exists = !!(this.exists && this.id);
        this.gen = data.gen || 0;
        this.damageTaken = data.damageTaken || {};
        this.HPivs = data.HPivs || {};
        this.HPdvs = data.HPdvs || {};
    }
    toString() {
        return this.name;
    }
}
exports.Type = Type;
const Natures = {
    adamant: { name: 'Adamant', plus: 'atk', minus: 'spa' },
    bashful: { name: 'Bashful' },
    bold: { name: 'Bold', plus: 'def', minus: 'atk' },
    brave: { name: 'Brave', plus: 'atk', minus: 'spe' },
    calm: { name: 'Calm', plus: 'spd', minus: 'atk' },
    careful: { name: 'Careful', plus: 'spd', minus: 'spa' },
    docile: { name: 'Docile' },
    gentle: { name: 'Gentle', plus: 'spd', minus: 'def' },
    hardy: { name: 'Hardy' },
    hasty: { name: 'Hasty', plus: 'spe', minus: 'def' },
    impish: { name: 'Impish', plus: 'def', minus: 'spa' },
    jolly: { name: 'Jolly', plus: 'spe', minus: 'spa' },
    lax: { name: 'Lax', plus: 'def', minus: 'spd' },
    lonely: { name: 'Lonely', plus: 'atk', minus: 'def' },
    mild: { name: 'Mild', plus: 'spa', minus: 'def' },
    modest: { name: 'Modest', plus: 'spa', minus: 'atk' },
    naive: { name: 'Naive', plus: 'spe', minus: 'spd' },
    naughty: { name: 'Naughty', plus: 'atk', minus: 'spd' },
    quiet: { name: 'Quiet', plus: 'spa', minus: 'spe' },
    quirky: { name: 'Quirky' },
    rash: { name: 'Rash', plus: 'spa', minus: 'spd' },
    relaxed: { name: 'Relaxed', plus: 'def', minus: 'spe' },
    sassy: { name: 'Sassy', plus: 'spd', minus: 'spe' },
    serious: { name: 'Serious' },
    timid: { name: 'Timid', plus: 'spe', minus: 'atk' },
};
const DATA = {
    Abilities: AbilitiesJSON,
    Aliases: AliasesJSON,
    Items: ItemsJSON,
    Moves: MovesJSON,
    Species: SpeciesJSON,
    Natures,
    Learnsets: null,
    Types: TypesJSON,
    FormatsData: FormatsDataJSON,
};
const HP_TYPES = [
    'Fighting', 'Flying', 'Poison', 'Ground', 'Rock', 'Bug', 'Ghost', 'Steel',
    'Fire', 'Water', 'Grass', 'Electric', 'Psychic', 'Ice', 'Dragon', 'Dark',
];
const GEN_IDS = ['gen1', 'gen2', 'gen3', 'gen4', 'gen5', 'gen6', 'gen7', 'gen8'];
const CURRENT_GEN_ID = GEN_IDS[7];
const dexes = Object.create(null);
const nullEffect = new PureEffect({ name: '', exists: false });
class ModdedDex {
    constructor(genid = CURRENT_GEN_ID) {
        this.cache = {
            Abilities: Object.create(null),
            Items: Object.create(null),
            Moves: Object.create(null),
            Species: Object.create(null),
            Types: Object.create(null),
            Learnsets: Object.create(null),
            Effects: Object.create(null),
            PureEffects: Object.create(null),
        };
        if (!GEN_IDS.includes(genid))
            throw new Error('Unsupported genid');
        this.genid = genid;
        this.gen = parseInt(genid.slice(3));
        this.loadData();
    }
    get modid() {
        return this.genid;
    }
    mod(genid) {
        if (genid in dexes)
            return dexes[genid];
        dexes[genid] = new ModdedDex(genid);
        return dexes[genid];
    }
    forGen(gen) {
        if (!gen)
            return this;
        return this.mod(`gen${gen}`);
    }
    getSpecies(name) {
        if (name && typeof name !== 'string')
            return name;
        name = (name || '').trim();
        let id = toID(name);
        if (id === 'nidoran' && name.slice(-1) === '♀') {
            id = 'nidoranf';
        }
        else if (id === 'nidoran' && name.slice(-1) === '♂') {
            id = 'nidoranm';
        }
        let species = this.cache.Species[id];
        if (species)
            return species;
        const alias = this.data.Aliases[id];
        if (alias) {
            const data = this.data.FormatsData[id];
            if (data) {
                // special event ID, like Rockruff-Dusk
                const baseId = toID(alias);
                species = new Species({ name }, this.data.Species[baseId], this.data.FormatsData[id]);
                species.name = id;
                species.species = id; // BUG ???
                species.speciesid = id; // BUG ???
                species.abilities = { 0: species.abilities['S'] };
            }
            else {
                species = this.getSpecies(alias);
                if (species.cosmeticFormes) {
                    for (const forme of species.cosmeticFormes) {
                        if (toID(forme) === id) {
                            species = new Species(species, {
                                name: forme,
                                id,
                                forme: forme.slice(species.name.length + 1),
                                baseForme: '',
                                baseSpecies: species.name,
                                otherFormes: null,
                                cosmeticFormes: null,
                            });
                            break;
                        }
                    }
                }
            }
            if (species === null || species === void 0 ? void 0 : species.exists)
                this.cache.Species[id] = species;
            return species;
        }
        let data = this.data.Species[id];
        if (id && !data) {
            let aliasTo = '';
            const formeNames = {
                alola: ['a', 'alola', 'alolan'],
                galar: ['g', 'galar', 'galarian'],
                gmax: ['gigantamax', 'gmax'],
                mega: ['m', 'mega'],
                primal: ['p', 'primal'],
            };
            for (const forme in formeNames) {
                let pokeName = '';
                for (const i of formeNames[forme]) {
                    if (id.startsWith(i)) {
                        pokeName = id.slice(i.length);
                    }
                    else if (id.endsWith(i)) {
                        pokeName = id.slice(0, -i.length);
                    }
                }
                const aliased = this.data.Aliases[pokeName];
                if (aliased)
                    pokeName = toID(aliased);
                if (this.data.Species[pokeName + forme]) {
                    aliasTo = pokeName + forme;
                    break;
                }
            }
            if (aliasTo) {
                species = this.getSpecies(aliasTo);
                if (species.exists) {
                    this.cache.Species[id] = species;
                    return species;
                }
            }
        }
        data = this.data.Species[id];
        if (id && data) {
            species = new Species({ name }, data, this.data.FormatsData[id]);
            if (!species.tier && !species.doublesTier && species.baseSpecies !== species.name) {
                if (species.baseSpecies === 'Mimikyu') {
                    const base = this.data.FormatsData[toID(species.baseSpecies)];
                    species.tier = base.tier || 'Illegal';
                    species.doublesTier = base.doublesTier || 'Illegal';
                }
                else if (species.id.endsWith('totem')) {
                    const base = this.data.FormatsData[species.id.slice(0, -5)];
                    species.tier = base.tier || 'Illegal';
                    species.doublesTier = base.doublesTier || 'Illegal';
                }
                else if (species.battleOnly) {
                    const base = this.data.FormatsData[toID(species.battleOnly)];
                    species.tier = base.tier || 'Illegal';
                    species.doublesTier = base.doublesTier || 'Illegal';
                }
                else {
                    const baseFormatsData = this.data.FormatsData[toID(species.baseSpecies)];
                    if (!baseFormatsData) {
                        throw new Error(`${species.baseSpecies} has no formats-data entry`);
                    }
                    species.tier = baseFormatsData.tier || 'Illegal';
                    species.doublesTier = baseFormatsData.doublesTier || 'Illegal';
                }
            }
            if (!species.tier)
                species.tier = 'Illegal';
            if (!species.doublesTier)
                species.doublesTier = species.tier;
            if (species.gen > this.gen) {
                species.tier = 'Illegal';
                species.doublesTier = 'Illegal';
                species.isNonstandard = 'Future';
            }
        }
        else {
            species = new Species({
                id, name, exists: false, tier: 'Illegal', doublesTier: 'Illegal', isNonstandard: 'Custom',
            });
        }
        if (species.exists)
            this.cache.Species[id] = species;
        return species;
    }
    hasAbility(species, ability) {
        for (const i in species.abilities) {
            if (ability === species.abilities[i])
                return true;
        }
        return false;
    }
    async getLearnset(name) {
        const id = toID(name);
        let learnset = this.cache.Learnsets[id];
        if (learnset)
            return learnset;
        if (!DATA.Learnsets) {
            const isNode = typeof process !== 'undefined' &&
                process.versions !== null &&
                process.versions.node !== null;
            if (isNode) {
                DATA.Learnsets = require('./data/learnsets.json');
            }
            else {
                // Casts required since Typescript thinks asynchronously imported JSON have default exports
                DATA.Learnsets =
                    (await Promise.resolve().then(() => __importStar(require('./data/learnsets.json'))));
            }
        }
        this.load('Learnsets');
        const data = this.data.Learnsets[id];
        if (id && data) {
            learnset = new Learnset(data);
        }
        else {
            learnset = new Learnset({ exists: false });
        }
        if (learnset.exists)
            this.cache.Learnsets[id] = learnset;
        return learnset;
    }
    getEffect(name) {
        if (!name)
            return nullEffect;
        if (typeof name !== 'string')
            return name;
        const id = toID(name);
        let effect = this.cache.Effects[id];
        if (effect)
            return effect;
        if (name.startsWith('move:')) {
            effect = this.getMove(name.slice(5));
        }
        else if (name.startsWith('item:')) {
            effect = this.getItem(name.slice(5));
        }
        else if (name.startsWith('ability:')) {
            effect = this.getAbility(name.slice(8));
        }
        if (effect) {
            this.cache.Effects[id] = effect;
            return effect;
        }
        return this.getPureEffectByID(id);
    }
    getPureEffectByID(id) {
        if (!id)
            return nullEffect;
        let effect = this.cache.PureEffects[id];
        if (effect)
            return effect;
        let found;
        if ((this.data.Moves.hasOwnProperty(id) && (found = this.data.Moves[id]).effect) ||
            (this.data.Abilities.hasOwnProperty(id) && (found = this.data.Abilities[id]).effect) ||
            (this.data.Items.hasOwnProperty(id) && (found = this.data.Items[id]).effect)) {
            effect = new PureEffect({ name: found.name || id }, found.effect);
        }
        else if (id === 'recoil') {
            effect = new PureEffect({ id, name: 'Recoil', effectType: 'Recoil' });
        }
        else if (id === 'drain') {
            effect = new PureEffect({ id, name: 'Drain', effectType: 'Drain' });
        }
        else {
            effect = new PureEffect({ id, name: id, exists: false });
        }
        this.cache.PureEffects[id] = effect;
        return effect;
    }
    getAbility(name) {
        if (name && typeof name !== 'string')
            return name;
        name = (name || '').trim();
        let id = toID(name);
        const alias = this.data.Aliases[id];
        if (alias) {
            name = alias;
            id = toID(alias);
        }
        let ability = this.cache.Abilities[id];
        if (ability)
            return ability;
        const data = this.data.Abilities[id];
        if (id && data) {
            ability = new Ability({ name }, data);
            if (ability.gen > this.gen)
                ability.isNonstandard = 'Future';
            if (this.gen <= 2 && ability.id === 'noability')
                ability.isNonstandard = null;
        }
        else {
            ability = new Ability({ id, name, exists: false });
        }
        if (ability.exists)
            this.cache.Abilities[id] = ability;
        return ability;
    }
    getItem(name) {
        if (name && typeof name !== 'string')
            return name;
        name = (name || '').trim();
        let id = toID(name);
        const alias = this.data.Aliases[id];
        if (alias) {
            name = alias;
            id = toID(alias);
        }
        let item = this.cache.Items[id];
        if (item)
            return item;
        if (id && !this.data.Items[id] && this.data.Items[id + 'berry']) {
            item = this.getItem(id + 'berry');
            this.cache.Items[id] = item;
            return item;
        }
        const data = this.data.Items[id];
        if (id && data) {
            item = new Item({ name }, data);
            if (item.gen > this.gen)
                item.isNonstandard = 'Future';
        }
        else {
            item = new Item({ id, name, exists: false });
        }
        if (item.exists)
            this.cache.Items[id] = item;
        return item;
    }
    getMove(name) {
        if (name && typeof name !== 'string')
            return name;
        name = (name || '').trim();
        let id = toID(name);
        const alias = this.data.Aliases[id];
        if (alias) {
            name = alias;
            id = toID(alias);
        }
        let move = this.cache.Moves[id];
        if (move)
            return move;
        const data = this.data.Moves[id];
        if (id && data) {
            move = new Move({ name }, data);
            if (id.substr(0, 11) === 'hiddenpower') {
                id = /([a-z]*)([0-9]*)/.exec(id)[1];
            }
            else if (id.substr(0, 6) === 'return' && id.length > 6) {
                id = 'return';
                move.basePower = Number(id.slice(6));
            }
            else if (id.substr(0, 11) === 'frustration' && id.length > 11) {
                id = 'frustration';
                move.basePower = Number(id.slice(11));
            }
            if (this.gen <= 3 && data.category !== 'Status') {
                move.category = getGen3Category(data.type);
            }
            if (move.gen > this.gen)
                move.isNonstandard = 'Future';
        }
        else {
            move = new Move({ id, name, exists: false });
        }
        if (move.exists)
            this.cache.Moves[id] = move;
        return move;
    }
    getNature(name) {
        if (name && typeof name !== 'string')
            return name;
        name = (name || '').trim();
        const id = toID(name);
        let nature = {};
        if (id && id !== 'constructor' && this.data.Natures[id]) {
            nature = this.data.Natures[id];
            if (nature.cached)
                return nature;
            nature.cached = true;
            nature.exists = true;
        }
        if (!nature.id)
            nature.id = id;
        if (!nature.name)
            nature.name = name;
        if (!nature.effectType)
            nature.effectType = 'Nature';
        if (!nature.kind)
            nature.kind = 'Nature';
        if (!nature.gen)
            nature.gen = 3;
        return nature;
    }
    getType(name) {
        if (name && typeof name !== 'string')
            return name;
        name = (name || '').trim();
        let id = toID(name);
        const alias = this.data.Aliases[id];
        if (alias) {
            name = alias;
            id = toID(alias);
        }
        let type = this.cache.Types[id];
        if (type)
            return type;
        const typeName = id.charAt(0).toUpperCase() + id.substr(1);
        const data = this.data.Types[typeName];
        if (id && data) {
            type = new Type({ id, name: typeName }, data);
        }
        else {
            type = new Type({ id, name, exists: false });
        }
        if (type.exists)
            this.cache.Types[id] = type;
        return type;
    }
    getImmunity(source, target) {
        var _a;
        const sourceType = typeof source !== 'string' ? source.type : source;
        // @ts-ignore
        const targetTyping = ((_a = target.getTypes) === null || _a === void 0 ? void 0 : _a.call(target)) || target.types || target;
        if (Array.isArray(targetTyping)) {
            for (const type of targetTyping) {
                if (!this.getImmunity(sourceType, type))
                    return false;
            }
            return true;
        }
        const typeData = this.data.Types[targetTyping];
        if (typeData && typeData.damageTaken[sourceType] === 3)
            return false;
        return true;
    }
    getEffectiveness(source, target) {
        var _a;
        const sourceType = typeof source !== 'string' ? source.type : source;
        // @ts-ignore
        const targetTyping = ((_a = target.getTypes) === null || _a === void 0 ? void 0 : _a.call(target)) || target.types || target;
        let totalTypeMod = 0;
        if (Array.isArray(targetTyping)) {
            for (const type of targetTyping) {
                totalTypeMod += this.getEffectiveness(sourceType, type);
            }
            return totalTypeMod;
        }
        const typeData = this.data.Types[targetTyping];
        if (!typeData)
            return 0;
        switch (typeData.damageTaken[sourceType]) {
            case 1: return 1; // super-effective
            case 2: return -1; // resist
            // in case of weird situations like Gravity, immunity is handled elsewhere
            default: return 0;
        }
    }
    getHiddenPower(ivs) {
        const tr = (num, bits = 0) => {
            if (bits)
                return (num >>> 0) % (2 ** bits);
            return num >>> 0;
        };
        const stats = { hp: 31, atk: 31, def: 31, spe: 31, spa: 31, spd: 31 };
        if (this.gen <= 2) {
            // Gen 2 specific Hidden Power check. IVs are still treated 0-31 so we get them 0-15
            const atkDV = tr(ivs.atk / 2);
            const defDV = tr(ivs.def / 2);
            const speDV = tr(ivs.spe / 2);
            const spcDV = tr(ivs.spa / 2);
            return {
                type: HP_TYPES[4 * (atkDV % 4) + (defDV % 4)],
                power: tr((5 * ((spcDV >> 3) +
                    (2 * (speDV >> 3)) +
                    (4 * (defDV >> 3)) +
                    (8 * (atkDV >> 3))) +
                    (spcDV % 4)) / 2 + 31),
            };
        }
        else {
            // Hidden Power check for Gen 3 onwards
            let hpTypeX = 0;
            let hpPowerX = 0;
            let i = 1;
            for (const s in stats) {
                hpTypeX += i * (ivs[s] % 2);
                hpPowerX += i * (tr(ivs[s] / 2) % 2);
                i *= 2;
            }
            return {
                type: HP_TYPES[tr(hpTypeX * 15 / 63)],
                // After Gen 6, Hidden Power is always 60 base power
                power: (this.gen && this.gen < 6) ? tr(hpPowerX * 40 / 63) + 30 : 60,
            };
        }
    }
    loadData() {
        if (this.data)
            return this.data;
        this.data = {};
        for (const t in DATA) {
            const type = t;
            if (type === 'Learnsets')
                continue; // async
            if (type === 'Natures' || type === 'Aliases') {
                this.data[type] = DATA[type];
                continue;
            }
            this.load(type);
        }
        return this.data;
    }
    includeModData() {
        for (const mod in dexes) {
            dexes[mod].includeData();
        }
        return this;
    }
    includeData() {
        this.loadData();
        return this;
    }
    includeFormats() {
        return this;
    }
    load(type) {
        if (this.data[type])
            return;
        const d = DATA[type][this.gen];
        if (d !== this.data[type])
            this.data[type] = Object.assign({}, d, this.data[type]);
        if (this.genid === CURRENT_GEN_ID)
            return;
        const parentDex = this.forGen(this.gen + 1);
        if (type === 'Learnsets')
            parentDex.load('Learnsets');
        const parentDataType = parentDex.data[type];
        const childDataType = this.data[type] || (this.data[type] = {});
        for (const e in parentDataType) {
            const entry = e;
            if (childDataType[entry] === null) {
                // null means don't inherit
                delete childDataType[entry];
            }
            else if (!(entry in childDataType)) {
                // If it doesn't exist it's inherited from the parent data
                if (type === 'Species') {
                    // Species entries can be modified too many different ways
                    // e.g. inheriting different formats-data/learnsets
                    childDataType[entry] = deepClone(parentDataType[entry]);
                }
                else {
                    childDataType[entry] = parentDataType[entry];
                }
            }
            else if (childDataType[entry] && childDataType[entry].inherit) {
                // {inherit: true} can be used to modify only parts of the parent data,
                // instead of overwriting entirely
                delete childDataType[entry].inherit;
                // Merge parent into children entry, preserving existing childs' properties.
                for (const key in parentDataType[entry]) {
                    if (key in childDataType[entry])
                        continue;
                    (childDataType[entry])[key] = parentDataType[entry][key];
                }
            }
        }
    }
}
exports.ModdedDex = ModdedDex;
ModdedDex.STATS = ['hp', 'atk', 'def', 'spa', 'spd', 'spe'];
const SPECIAL = ['Fire', 'Water', 'Grass', 'Electric', 'Ice', 'Psychic', 'Dark', 'Dragon'];
function getGen3Category(type) {
    return SPECIAL.includes(type) ? 'Special' : 'Physical';
}
function deepClone(obj) {
    if (obj === null || typeof obj !== 'object')
        return obj;
    if (Array.isArray(obj))
        return obj.map(prop => deepClone(prop));
    const clone = Object.create(Object.getPrototypeOf(obj));
    for (const key of Object.keys(obj)) {
        clone[key] = deepClone(obj[key]);
    }
    return clone;
}
// #endregion
dexes[CURRENT_GEN_ID] = new ModdedDex(CURRENT_GEN_ID);
exports.Dex = dexes[CURRENT_GEN_ID];
//# sourceMappingURL=index.js.map