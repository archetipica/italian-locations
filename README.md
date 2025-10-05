# Italian Locations

🇮🇹 Complete TypeScript library for Italian locations: municipalities, provinces, postal codes with advanced search and autocomplete

A lightweight, performant TypeScript library providing access to all Italian municipalities, provinces, and regions with intelligent search capabilities, CAP validation, and autocomplete support.

✨ Features

- 🚀 High Performance: Optimized searches with in-memory indices (O(1) lookups)
- 📦 Tree-shakable: Import only what you need
- 🔍 Smart Search: Advanced algorithms with relevance scoring (Jaro-Winkler similarity)
- 🎯 TypeScript Native: Full type safety and IntelliSense support
- 📱 Zero Dependencies: No external libraries required
- 🌐 Dual ESM/CJS: Supports both module formats
- 🔄 Always Updated: Data synced with official ISTAT sources


## 📦 Installation

```bash
npm install italian-locations
# or
yarn add italian-locations
# or
pnpm add italian-locations
```


## 🚀 Quick Start

```typescript
import { searchComuni, getComuniByCAP, isValidCAP } from 'italian-locations';


// Search municipalities by name
const results = searchComuni('Milano', { limit: 5 });
console.log(results[0].item.nome); // "Milano"


// Find municipalities by postal code
const comuni = getComuniByCAP('20100');
console.log(comuni[0].nome); // "Milano"


// Validate Italian postal codes
console.log(isValidCAP('20100')); // true
console.log(isValidCAP('99999')); // false
```


## 🔍 Advanced Search

```typescript
import { searchComuni, searchComuniWithFilters } from 'italian-locations'


// Search with options
const results = searchComuni('Rom', {
  exactMatch: false,     // partial search (default)
  limit: 10,            // max 10 results
  soloCapoluoghi: true  // only provincial capitals
})


// Search with geographical filters
const filteredResults = searchComuniWithFilters('San', 
  {
    regione: 'Lombardia',
    provincia: 'Milano'
  },
  { limit: 5 }
)
```


## 🏛️ Working with Provinces and Regions

```typescript
import { 
  getAllProvince, 
  getComuniByProvincia, 
  getComuniByRegione,
  getCapoluoghi,
  getProvinceByRegione
} from 'italian-locations'


// Get all provinces (alphabetically sorted)
const province = getAllProvince()


// Municipalities by province
const comuniMilano = getComuniByProvincia('Milano') // or 'MI'


// Municipalities by region  
const comuniLombardia = getComuniByRegione('Lombardia')


// Get provinces in a region (alphabetically sorted)
const provinceLombardia = getProvinceByRegione('Lombardia')


// Only provincial capitals
const capoluoghi = getCapoluoghi()


```


## 🔮 Autocomplete

```typescript
import { getSuggestions } from 'italian-locations'


// For implementing autocomplete
const suggestions = getSuggestions('Mil', 5)
// ['Milano', 'Milazzo', 'Militello in Val di Catania', ...]
```

\#\# 📊 Data Access

```typescript
import comuniItaliani from 'italian-locations'


// Complete data access
const stats = comuniItaliani.getStats()
console.log(`Total municipalities: ${stats.totaleComuni}`)


// Single municipality by ISTAT code
const roma = comuniItaliani.getComuneByIstat('058091')


// All regions (alphabetically sorted)
const regioni = comuniItaliani.getAllRegioni()


```


## 🏗️ Form Integration Example

```typescript
import { searchComuni, isValidCAP, getSuggestions } from 'italian-locations'


// React component example
function CityAutocomplete({ value, onChange }) {
  const [suggestions, setSuggestions] = useState([])


  const handleInputChange = (query) => {
    const results = getSuggestions(query, 10)
    setSuggestions(results)
  }


  const handleCitySelect = (cityName) => {
    const results = searchComuni(cityName, { exactMatch: true })
    if (results.length > 0) {
      const comune = results[0].item
      onChange({
        comune: comune.nome,
        provincia: comune.nomeProvincia,
        cap: comune.cap,
        regione: comune.nomeRegione
      })
    }
  }


  // ... rest of component
}


```

\#\# 📋 TypeScript Types

```typescript
interface Regione {
  codiceRegione: string
  nome: string
  tipologia: string
  ripartizioneGeografica: string
  numeroProvince: number
  numeroComuni: number
  superficie: number // in km²
}


interface Provincia {
  codiceRegione: string
  sigla: string
  nome: string
  tipologia: string
  numeroComuni: number
  superficie: number // in km²
  codiceSovracomunale: string
}


interface Comune {
  codiceIstat: string
  nome: string
  nomeAlternativo?: string
  cap: string
  codiceBelfiore: string
  siglaProvincia: string
  nomeProvincia: string
  codiceRegione: string
  nomeRegione: string
  tipologiaRegione: string
  ripartizioneGeografica: string
  isCapoluogo: boolean
  coordinate: {
    lat: number
    lng: number
  }
  superficie: number
}


interface SearchOptions {
  caseSensitive?: boolean
  exactMatch?: boolean
  limit?: number
  soloCapoluoghi?: boolean
}


interface SearchResult<T> {
  item: T
  score: number
}
```

How to use all interfaces:

```typescript
// Working with the complete hierarchy
const regione: Regione = getAllRegioni()[0]
const province: Provincia[] = getProvinceByRegione(regione.nome)
const comuni: Comune[] = getComuniByProvincia(province[0].sigla)


console.log(`${regione.nome} has ${regione.numeroProvince} provinces and ${regione.numeroComuni} municipalities`)


const regionePuglia: Regione = getRegioneByCode('16')
const provincePuglia: Provincia[] = getProvinceByCodeRegione(regionePuglia.codiceRegione)


console.log(`${regionePuglia.nome} has ${regionePuglia.numeroProvince}`)


```

\#\# ⚡ Performance

- Bundle size: ~4MB compressed (complete dataset)
- Search speed: O(1) for CAP and ISTAT codes, O(n) optimized for names
- Memory footprint: ~20MB runtime (indices included)
- Tree-shaking: Full support, import only used functions

\#\# 📊 Data Source

This library uses the comprehensive Italian municipalities database provided by (https://www.gardainformatica.it/database-comuni-italiani)[Garda Informatica].

The database includes:

- 8,000+ Italian municipalities
- 110+ provinces and metropolitan cities
- 20 regions
- Postal codes (CAP)
- ISTAT codes
- Geographic coordinates
- Administrative boundaries

Data Features:

- ✅ Always Updated: Automatically synchronized with official ISTAT sources
- ✅ Complete: All Italian administrative divisions
- ✅ Free: Released under MIT license
- ✅ Reliable: Used by professionals and developers

Last Update: June 30, 2025

\#\# 🙏 Credits

Special thanks to [Garda Informatica](https://www.gardainformatica.it/database-comuni-italiani) for providing and maintaining this comprehensive, free, and always up-to-date database of Italian municipalities. Their automated procedures ensure the data stays current with official ISTAT sources.

Visit their website: [https://www.gardainformatica.it/database-comuni-italiani](https://www.gardainformatica.it/database-comuni-italiani)

\#\# 🔄 Data Updates

The underlying data is regularly updated from official ISTAT sources. New versions of this library are released when significant administrative changes occur (new municipalities, province modifications, etc.).

## 📄 License

MIT License - see LICENSE file

Original database by Garda Informatica is also released under MIT License.

\#\# 🤝 Contributing

Contributions are welcome! Please open issues and pull requests.

Made with ❤️ for the Italian developer community

Ecco il tuo README corretto con tutti gli errori di sintassi risolti:

# Italian Locations

🇮🇹 **Complete TypeScript library for Italian locations: municipalities, provinces, postal codes with advanced search and autocomplete**

A lightweight, performant TypeScript library providing access to all Italian municipalities, provinces, and regions with intelligent search capabilities, CAP validation, and autocomplete support.

## ✨ Features

- 🚀 **High Performance**: Optimized searches with in-memory indices (O(1) lookups)
- 📦 **Tree-shakable**: Import only what you need
- 🔍 **Smart Search**: Advanced algorithms with relevance scoring (Jaro-Winkler similarity)
- 🎯 **TypeScript Native**: Full type safety and IntelliSense support
- 📱 **Zero Dependencies**: No external libraries required
- 🌐 **Dual ESM/CJS**: Supports both module formats
- 🔄 **Always Updated**: Data synced with official ISTAT sources


## 📦 Installation

```bash
npm install italian-locations
# or
yarn add italian-locations
# or
pnpm add italian-locations
```


## 🚀 Quick Start

```typescript
import { searchComuni, getComuniByCAP, isValidCAP } from 'italian-locations'

// Search municipalities by name
const results = searchComuni('Milano', { limit: 5 })
console.log(results[^0].item.nome) // "Milano"

// Find municipalities by postal code
const comuni = getComuniByCAP('20100')
console.log(comuni[^0].nome) // "Milano"

// Validate Italian postal codes
console.log(isValidCAP('20100')) // true
console.log(isValidCAP('99999')) // false
```


## 🔍 Advanced Search

```typescript
import { searchComuni, searchComuniWithFilters } from 'italian-locations'

// Search with options
const results = searchComuni('Rom', {
  exactMatch: false,     // partial search (default)
  limit: 10,            // max 10 results
  soloCapoluoghi: true  // only provincial capitals
})

// Search with geographical filters
const filteredResults = searchComuniWithFilters('San', 
  {
    regione: 'Lombardia',
    provincia: 'Milano'
  },
  { limit: 5 }
)
```


## 🏛️ Working with Provinces and Regions

```typescript
import { 
  getAllProvince, 
  getComuniByProvincia, 
  getComuniByRegione,
  getCapoluoghi,
  getProvinceByRegione
} from 'italian-locations'

// Get all provinces (alphabetically sorted)
const province = getAllProvince()

// Municipalities by province
const comuniMilano = getComuniByProvincia('Milano') // or 'MI'

// Municipalities by region  
const comuniLombardia = getComuniByRegione('Lombardia')

// Get provinces in a region (alphabetically sorted)
const provinceLombardia = getProvinceByRegione('Lombardia')

// Only provincial capitals
const capoluoghi = getCapoluoghi()
```


## 🔮 Autocomplete

```typescript
import { getSuggestions } from 'italian-locations'

// For implementing autocomplete
const suggestions = getSuggestions('Mil', 5)
// ['Milano', 'Milazzo', 'Militello in Val di Catania', ...]
```


## 📊 Data Access

```typescript
import comuniItaliani from 'italian-locations'

// Complete data access
const stats = comuniItaliani.getStats()
console.log(`Total municipalities: ${stats.totaleComuni}`)

// Single municipality by ISTAT code
const roma = comuniItaliani.getComuneByIstat('058091')

// All regions (alphabetically sorted)
const regioni = comuniItaliani.getAllRegioni()
```


## 🏗️ Form Integration Example

```typescript
import { searchComuni, isValidCAP, getSuggestions } from 'italian-locations'

// React component example
function CityAutocomplete({ value, onChange }) {
  const [suggestions, setSuggestions] = useState([])

  const handleInputChange = (query) => {
    const results = getSuggestions(query, 10)
    setSuggestions(results)
  }

  const handleCitySelect = (cityName) => {
    const results = searchComuni(cityName, { exactMatch: true })
    if (results.length > 0) {
      const comune = results[^0].item
      onChange({
        comune: comune.nome,
        provincia: comune.nomeProvincia,
        cap: comune.cap,
        regione: comune.nomeRegione
      })
    }
  }

  // ... rest of component
}
```


## 📋 TypeScript Types

```typescript
interface Regione {
  codiceRegione: string
  nome: string
  tipologia: string
  ripartizioneGeografica: string
  numeroProvince: number
  numeroComuni: number
  superficie: number // in km²
}

interface Provincia {
  codiceRegione: string
  sigla: string
  nome: string
  tipologia: string
  numeroComuni: number
  superficie: number // in km²
  codiceSovracomunale: string
}

interface Comune {
  codiceIstat: string
  nome: string
  nomeAlternativo?: string
  cap: string
  codiceBelfiore: string
  siglaProvincia: string
  nomeProvincia: string
  codiceRegione: string
  nomeRegione: string
  tipologiaRegione: string
  ripartizioneGeografica: string
  isCapoluogo: boolean
  coordinate: {
    lat: number
    lng: number
  }
  superficie: number
}

interface SearchOptions {
  caseSensitive?: boolean
  exactMatch?: boolean
  limit?: number
  soloCapoluoghi?: boolean
}

interface SearchResult<T> {
  item: T
  score: number
}
```


### How to use all interfaces:

```typescript
// Working with the complete hierarchy
const regione: Regione = getAllRegioni()[^0]
const province: Provincia[] = getProvinceByRegione(regione.nome)
const comuni: Comune[] = getComuniByProvincia(province[^0].sigla)

console.log(`${regione.nome} has ${regione.numeroProvince} provinces and ${regione.numeroComuni} municipalities`)

const regionePuglia: Regione = getRegioneByCode('16')
const provincePuglia: Provincia[] = getProvinceByCodeRegione(regionePuglia.codiceRegione)

console.log(`${regionePuglia.nome} has ${regionePuglia.numeroProvince}`)
```


## ⚡ Performance

- **Bundle size**: ~4MB compressed (complete dataset)
- **Search speed**: O(1) for CAP and ISTAT codes, O(n) optimized for names
- **Memory footprint**: ~20MB runtime (indices included)
- **Tree-shaking**: Full support, import only used functions


## 📊 Data Source

This library uses the comprehensive Italian municipalities database provided by **[Garda Informatica](https://www.gardainformatica.it/database-comuni-italiani)**.

The database includes:

- **8,000+** Italian municipalities
- **110+** provinces and metropolitan cities
- **20** regions
- Postal codes (CAP)
- ISTAT codes
- Geographic coordinates
- Administrative boundaries

**Data Features:**

- ✅ **Always Updated**: Automatically synchronized with official ISTAT sources
- ✅ **Complete**: All Italian administrative divisions
- ✅ **Free**: Released under MIT license
- ✅ **Reliable**: Used by professionals and developers

**Last Update**: June 30, 2025

## 🙏 Credits

Special thanks to **[Garda Informatica](https://www.gardainformatica.it/)** for providing and maintaining this comprehensive, free, and always up-to-date database of Italian municipalities. Their automated procedures ensure the data stays current with official ISTAT sources.

Visit their website: [https://www.gardainformatica.it/database-comuni-italiani](https://www.gardainformatica.it/database-comuni-italiani)

## 🔄 Data Updates

The underlying data is regularly updated from official ISTAT sources. New versions of this library are released when significant administrative changes occur (new municipalities, province modifications, etc.).

## 📄 License

MIT License - see [LICENSE](LICENSE) file

Original database by Garda Informatica is also released under MIT License.

## 🤝 Contributing

Contributions are welcome! Please open issues and pull requests.

## 🔗 Links

- [Repository](https://github.com/archetipica/italian-locations)
- [NPM Package](https://npmjs.com/package/italian-locations)
- [Data Source](https://www.gardainformatica.it/database-comuni-italiani)
- [Issues](https://github.com/yourusername/italian-locations/issues)

***

Made with ❤️ for the Italian developer community
