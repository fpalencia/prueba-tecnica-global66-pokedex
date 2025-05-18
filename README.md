# 🔴 Prueba Técnica Global66 - Pokedex

## 📝 Descripción del Proyecto

Este proyecto es una aplicación web tipo Pokedex desarrollada como prueba técnica para Global66. La aplicación permite a los usuarios explorar información sobre diferentes Pokémon, buscar por nombre, visualizar detalles en un modal interactivo, y guardar sus Pokémon favoritos.

## ✨ Características Principales

- **Listado de Pokémon**: Visualización de Pokémon con scroll infinito
- **Búsqueda**: Filtrado de Pokémon por nombre
- **Favoritos**: Funcionalidad para guardar y gestionar Pokémon favoritos
- **Modal de Detalle**: Ventana modal con información detallada de cada Pokémon
- **Diseño Responsivo**: Interfaz adaptable a diferentes dispositivos

## 🛠️ Tecnologías Utilizadas

- **Frontend**: Vue.js, TypeScript
- **Gestión de Estado**: Pinia
- **Estilos**: Tailwind CSS
- **API**: PokeAPI (https://pokeapi.co/)
- **HTTP Client**: Axios
- **Validación de Datos**: Zod
- **Utilidades**: VueUse
- **Gestión de Consultas**: TanStack Query
- **Testing**: Vitest, Vue Test Utils

## 🚀 Instalación

1. Clona este repositorio:
   ```bash
   git clone https://github.com/[tu-usuario]/pruebatecnica-global66-pokedex.git
   cd pruebatecnica-global66-pokedex
   ```

2. Instala las dependencias:
   ```bash
   npm install
   ```

3. Inicia el servidor de desarrollo:
   ```bash
   npm run dev
   ```

4. Abre tu navegador en `http://localhost:5173`

## 📂 Estructura del Proyecto

```

├── src
│   ├── api
│   │   └── pokemonApi.ts
│   ├── App.vue
│   ├── assets
│   │   ├── icons
│   │   │   ├── IconAll.vue
│   │   │   ├── IconClose.vue
│   │   │   ├── IconFavorite.vue
│   │   │   ├── IconPikachu.vue
│   │   │   └── IconPokeball.vue
│   │   └── images
│   │       ├── background-image.webp
│   │       └── WelcomeImage.vue
│   ├── components
│   │   ├── commons
│   │   │   ├── BtnAddFavorite.vue
│   │   │   ├── BtnFooter.vue
│   │   │   ├── InputSearch.vue
│   │   │   ├── Loading.vue
│   │   │   └── modal
│   │   │       ├── components
│   │   │       │   ├── Attributes.vue
│   │   │       │   ├── SkeletonAttributes.vue
│   │   │       │   └── SkeletonButtons.vue
│   │   │       └── PokemonCardDetails.vue
│   │   └── pokemon
│   │       ├── PokemonItem.vue
│   │       └── PokemonList.vue
│   ├── composables
│   │   ├── custom
│   │   │   ├── useCustomLocalStorage.ts
│   │   │   ├── useCustomVirtualList.ts
│   │   │   └── useInfinityScroll.ts
│   │   └── pokemons
│   │       ├── usePokemonCardDetails.ts
│   │       ├── usePokemonFavorite.ts
│   │       ├── usePokemonItem.ts
│   │       ├── usePokemonSearch.ts
│   │       ├── usePokemonsList.ts
│   │       └── usePokemons.ts
│   ├── helpers
│   │   └── index.ts
│   ├── layout
│   │   └── Layout.vue
│   ├── main.ts
│   ├── router
│   │   └── index.ts
│   ├── schema
│   │   ├── pokemon-list-response-schema.ts
│   │   ├── pokemon-response-schema.ts
│   │   └── pokemon-schema.ts
│   ├── services
│   │   └── getPokemonsServices.ts
│   ├── store
│   │   └── usePokemonStore.ts
│   ├── style.css
│   ├── __test__
│   │   ├── component
│   │   │   ├── commons
│   │   │   │   ├── BtnAddFavorite.spec.ts
│   │   │   │   ├── BtnFooter.spec.ts
│   │   │   │   ├── InputSearch.spec.ts
│   │   │   │   ├── Loading.spec.ts
│   │   │   │   └── modal
│   │   │   │       ├── components
│   │   │   │       │   ├── Attributes.spec.ts
│   │   │   │       │   ├── SkeletonAttributes.spec.ts
│   │   │   │       │   └── SkeletonButtons.spec.ts
│   │   │   │       └── PokemonCardDetails.spec.ts
│   │   │   └── pokemon
│   │   │       ├── PokemonItem.spec.ts
│   │   │       └── PokemonList.spec.ts
│   │   ├── composable
│   │   │   ├── custom
│   │   │   │   ├── useCustomInfinityScroll.spec.ts
│   │   │   │   ├── useCustomLocalStorage.spec.ts
│   │   │   │   └── useCustomVirtualList.spec.ts
│   │   │   └── pokemons
│   │   │       ├── usePokemonCardDetails.spec.ts
│   │   │       ├── usePokemonFavorite.spec.ts
│   │   │       ├── usePokemonItem.spec.ts
│   │   │       ├── usePokemonSearch.spec.ts
│   │   │       ├── usePokemonsList.spec.ts
│   │   │       └── usePokemons.spec.ts
│   │   ├── helpers
│   │   │   └── index.spec.ts
│   │   ├── store
│   │   │   └── usePokemonStore.spec.ts
│   │   └── views
│   │       ├── HomeView.spec.ts
│   │       ├── pokemons
│   │       │   └── PokemonsView.spec.ts
│   │       └── pokemons-favorite
│   │           └── PokemonsFavoriteView.spec.ts
│   ├── types
│   │   ├── pokemon-list.ts
│   │   ├── pokemon-response.ts
│   │   └── pokemon.ts
│   ├── views
│   │   ├── HomeView.vue
│   │   ├── pokemons
│   │   │   └── PokemonsView.vue
│   │   └── pokemons-favorite
│   │       └── PokemonsFavoriteView.vue

```

## Pruebas Unitarias

El proyecto incluye pruebas unitarias para los componentes principales utilizando Vitest y Vue Test Utils.

### Ejecutar las pruebas

Para ejecutar todas las pruebas unitarias:

```bash
npm run test
```

Para ejecutar las pruebas en modo watch (útil durante el desarrollo):

```bash
npm run test:watch
```

### Estructura de las pruebas

Las pruebas se encuentran en el directorio `src/__test__` y siguen la misma estructura que los componentes del proyecto. Cada componente, composable, store, helper tiene su propio archivo de prueba.