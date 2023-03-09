# 2.3.0

-   make sure only one GM runs the trade request
-   added french localization (thanks to [rectulo](https://github.com/rectulo))

# 2.2.2

Exposed two function to the module api:

```js
/**
 * Retrieves the API object containing the funtions
 */
game.modules.get('pf2e-hero-actions').api
```

```js
/**
 * @param {CharacterPF2e} actor
 * @returns {Array<{ uuid: string; name: string }>} the actions on the actor
 */
function getHeroActions: (actor: CharacterPF2e) => Array<{ uuid: string; name: string }>
```

```js
/**
 * Will consume a hero point and remove the action from the actor
 * Displaying a ChatMessage with the details
 *
 * @param {CharacterPF2e} actor
 * @param {string} uuid of the action
 */
function useHeroAction: (actor: CharacterPF2e, uuid: string) => Promise<void>
```

# 2.2.1

-   fixed a bug with formula checking and prevent modification of compendium table.

# 2.2.0

-   characters can now trade Hero Actions with each others.

# 2.0.0

-   the module has received a complete makeover and now allows the use of custom actions and table.

# 1.0.0

-   original release