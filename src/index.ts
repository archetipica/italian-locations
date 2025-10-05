import comuniRawData from './data/gi_comuni_cap.json';
import provinceRawData from './data/gi_province.json';
import regioniRawData from './data/gi_regioni.json';
import type {
  ComuneRaw,
  ProvinciaRaw,
  RegioneRaw,
  Comune,
  Provincia,
  Regione,
  SearchOptions,
  SearchResult,
  SearchFilters,
  StatsCompleto,
} from './types';
import {
  normalizeComuneData,
  normalizeProvinciaData,
  normalizeRegioneData,
} from './utils/normalize';
import {
  searchComuni as searchComuniUtil,
  searchProvince as searchProvinceUtil,
  searchRegioni as searchRegioniUtil,
  searchComuniWithFilters as searchComuniWithFiltersUtil,
  getCapoluoghi as getCapoluoghiUtil, // ⬅️ Rinominato
  getProvinceByRegioneWithRegioni as getProvinceByRegioneUtil, // ⬅️ Nome corretto
  isValidCAP,
  getSuggestionsComuni,
} from './utils/search';

/**
 * Classe principale per la gestione completa di regioni, province e comuni italiani
 */
class ComuniItaliani {
  private regioni: Regione[] = [];
  private province: Provincia[] = [];
  private comuni: Comune[] = [];

  // Indici per performance O(1)
  private regioniByCode: Map<string, Regione> = new Map();
  private provinceByCode: Map<string, Provincia> = new Map();
  private provinceBySignla: Map<string, Provincia> = new Map();
  private comuniByIstat: Map<string, Comune> = new Map();
  private comuniByCAP: Map<string, Comune[]> = new Map();
  private comuniByProvincia: Map<string, Comune[]> = new Map();
  private comuniByRegione: Map<string, Comune[]> = new Map();

  private initialized = false;

  constructor() {
    this.initialize();
  }

  private initialize(): void {
    if (this.initialized) return;

    try {
      // Carica e normalizza tutti e tre i dataset
      const rawRegioni = regioniRawData as RegioneRaw[];
      const rawProvince = provinceRawData as ProvinciaRaw[];
      const rawComuni = comuniRawData as ComuneRaw[];

      this.regioni = rawRegioni.map((raw) => normalizeRegioneData(raw));
      this.province = rawProvince.map((raw) => normalizeProvinciaData(raw));
      this.comuni = rawComuni.map((raw) => normalizeComuneData(raw));

      this.createIndices();
      this.initialized = true;
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error)
        throw new Error(`Impossibile caricare i dati geografici italiani: ${errorMessage}`)
    }
  }

  private createIndices(): void {
    // Indici regioni
    for (const regione of this.regioni) {
      this.regioniByCode.set(regione.codiceRegione, regione);
    }

    // Indici province
    for (const provincia of this.province) {
      this.provinceByCode.set(
        provincia.codiceRegione + provincia.sigla,
        provincia
      );
      this.provinceBySignla.set(provincia.sigla.toLowerCase(), provincia);
    }

    // Indici comuni
    for (const comune of this.comuni) {
      this.comuniByIstat.set(comune.codiceIstat, comune);

      // Indice CAP
      if (!this.comuniByCAP.has(comune.cap)) {
        this.comuniByCAP.set(comune.cap, []);
      }
      this.comuniByCAP.get(comune.cap)!.push(comune);

      // Indice provincia
      const provinciaKeys = [
        comune.siglaProvincia.toLowerCase(),
        comune.nomeProvincia.toLowerCase(),
      ];
      for (const key of provinciaKeys) {
        if (!this.comuniByProvincia.has(key)) {
          this.comuniByProvincia.set(key, []);
        }
        this.comuniByProvincia.get(key)!.push(comune);
      }

      // Indice regione
      const regioneKey = comune.nomeRegione.toLowerCase();
      if (!this.comuniByRegione.has(regioneKey)) {
        this.comuniByRegione.set(regioneKey, []);
      }
      this.comuniByRegione.get(regioneKey)!.push(comune);
    }
  }

  // === METODI PUBBLICI ===

  searchRegioni(
    query: string,
    options?: SearchOptions
  ): SearchResult<Regione>[] {
    return searchRegioniUtil(this.regioni, query, options);
  }

  searchProvince(
    query: string,
    options?: SearchOptions
  ): SearchResult<Provincia>[] {
    return searchProvinceUtil(this.province, query, options);
  }

  searchComuni(query: string, options?: SearchOptions): SearchResult<Comune>[] {
    return searchComuniUtil(this.comuni, query, options);
  }

  getRegioneByCode(codiceRegione: string): Regione | undefined {
    return this.regioniByCode.get(codiceRegione);
  }

  getProvinciaBySigla(sigla: string): Provincia | undefined {
    return this.provinceBySignla.get(sigla.toLowerCase());
  }

  getComuneByIstat(codiceIstat: string): Comune | undefined {
    return this.comuniByIstat.get(codiceIstat);
  }

  getComuniByCAP(cap: string): Comune[] {
    return this.comuniByCAP.get(cap.trim()) || [];
  }

  getComuniByProvincia(provincia: string): Comune[] {
    const key = provincia.toLowerCase().trim();
    return this.comuniByProvincia.get(key) || [];
  }

  getComuniByRegione(regione: string): Comune[] {
    const key = regione.toLowerCase().trim();
    return this.comuniByRegione.get(key) || [];
  }

  searchComuniWithFilters(
    query: string,
    filters: SearchFilters,
    options?: SearchOptions
  ): SearchResult<Comune>[] {
    return searchComuniWithFiltersUtil(this.comuni, query, filters, options);
  }

  getCapoluoghi(): Comune[] {
    return getCapoluoghiUtil(this.comuni); // ⬅️ Usa utility rinominata
  }

  getAllRegioni(): Regione[] {
    return [...this.regioni].sort((a, b) => a.nome.localeCompare(b.nome));
  }

  /**
   * Ottieni tutte le province ordinate alfabeticamente
   */
  getAllProvince(): Provincia[] {
    return [...this.province].sort((a, b) => a.nome.localeCompare(b.nome));
  }

  getAllComuni(): Comune[] {
    return [...this.comuni];
  }

  getAllRipartizioni(): string[] {
    const ripartizioni = new Set(
      this.regioni.map((r) => r.ripartizioneGeografica)
    );
    return Array.from(ripartizioni).sort();
  }

  isValidCAP(cap: string): boolean {
    return isValidCAP(cap);
  }

  getSuggestions(query: string, limit: number = 10): string[] {
    return getSuggestionsComuni(this.comuni, query, limit);
  }

  getStats(): StatsCompleto {
    const superficieTotale = this.regioni.reduce(
      (sum, r) => sum + r.superficie,
      0
    );

    return {
      totaleRegioni: this.regioni.length,
      totaleProvince: this.province.length,
      totaleComuni: this.comuni.length,
      totaleCapoluoghi: this.getCapoluoghi().length,
      totaleRipartizioni: this.getAllRipartizioni().length,
      superficieTotale,
    };
  }

  /**
   * Ottieni province per regione
   */
  getProvinceByRegione(regione: string): Provincia[] {
    return getProvinceByRegioneUtil(this.province, this.regioni, regione);
  }

  /**
   * Ottieni province per codice regione - ordinate alfabeticamente
   */
  getProvinceByCodeRegione(codiceRegione: string): Provincia[] {
    return this.province
      .filter((provincia) => provincia.codiceRegione === codiceRegione)
      .sort((a, b) => a.nome.localeCompare(b.nome));
  }
}

// Istanza singleton
const comuniItaliani = new ComuniItaliani();

export default comuniItaliani;

// Export funzioni principali
export const searchRegioni = comuniItaliani.searchRegioni.bind(comuniItaliani);
export const searchProvince =
  comuniItaliani.searchProvince.bind(comuniItaliani);
export const searchComuni = comuniItaliani.searchComuni.bind(comuniItaliani);
export const getRegioneByCode =
  comuniItaliani.getRegioneByCode.bind(comuniItaliani);
export const getProvinciaBySigla =
  comuniItaliani.getProvinciaBySigla.bind(comuniItaliani);
export const getComuneByIstat =
  comuniItaliani.getComuneByIstat.bind(comuniItaliani);
export const getComuniByCAP =
  comuniItaliani.getComuniByCAP.bind(comuniItaliani);
export const getComuniByProvincia =
  comuniItaliani.getComuniByProvincia.bind(comuniItaliani);
export const getComuniByRegione =
  comuniItaliani.getComuniByRegione.bind(comuniItaliani);
export const searchComuniWithFilters =
  comuniItaliani.searchComuniWithFilters.bind(comuniItaliani);
export const getCapoluoghi = comuniItaliani.getCapoluoghi.bind(comuniItaliani);
export const getAllRegioni = comuniItaliani.getAllRegioni.bind(comuniItaliani);
export const getAllProvince =
  comuniItaliani.getAllProvince.bind(comuniItaliani);
export const getAllComuni = comuniItaliani.getAllComuni.bind(comuniItaliani);
export const getAllRipartizioni =
  comuniItaliani.getAllRipartizioni.bind(comuniItaliani);
export const getSuggestions =
  comuniItaliani.getSuggestions.bind(comuniItaliani);
export const getStats = comuniItaliani.getStats.bind(comuniItaliani);
export const getProvinceByRegione =
  comuniItaliani.getProvinceByRegione.bind(comuniItaliani);
export const getProvinceByCodeRegione =
  comuniItaliani.getProvinceByCodeRegione.bind(comuniItaliani);
export { isValidCAP };

// Export tipi
export type {
  Regione,
  Provincia,
  Comune,
  RegioneRaw,
  ProvinciaRaw,
  ComuneRaw,
  SearchOptions,
  SearchResult,
  SearchFilters,
  StatsCompleto,
};
