# FoundryVTT PF2e Hero Actions

https://www.youtube.com/watch?v=8EezVnYQKyo

This module integrates and automates the `Hero Deck` actions into the PF2e system.

It adds a new section in the `actions` tab of the character sheet where a player can **Draw**, **Discard** or **Use** `Hero Actions` in concert with the regular `Hero Points`.

It works as follow:

-   If the character has more `Hero Points` than `Hero Actions`, the player will be asked to **Draw** new `Hero Actions` to fill in.

-   If the character has more `Hero Actions` than `Hero Points`, the player will be asked to **Discard** the excess of `Hero Actions`.

-   Otherwise the player will have the opportunity to **Use** any `Hero Actions` that are available to them, doing so will also spend one `Hero Point` from the character pool.

# Unique draw pool

By default, characters will draw randomly from a `hero Action` table without regard for which actions have already been drawn before.

If you want to have an unique action pool from which the actions are "removed" on draw until the pool is emptied (at which point, the pool will be refilled), you need to have a physical `Table` in your world.

Simply import the table from the compendium and uncheck the `Draw With Replacement?` option.

# Custom table

You can also have your own `Hero Actions` and table to draw them, to do so, you will need valid journal entries (in your world or in a compendium) and a table used to draw them.

![](./readme/settings.webp)

Because the module cannot infer which table you are using in the case of a custom table, you will need to provide its UUID manually in the settings, to do so, open your table and `Right-Click` on the 📔 next to its name in the title bar, this will copy its UUID to your clipboard.

# Trading

Characters can trade `Hero Action` between each others.

![](./readme/trade.webp)

If the initiating player is the owner of both characters (or is the GM), the trade will automatically be accepted.

![](./readme//request.webp)

The owner of the character traded with will receive a request popup and can accept or refuse the deal offered. If the player is not online, the GM will receive the request instead.

# Macros

## Table Creation

![](./readme/create.webp)

A macro has been added to the compendium to help you setup up your table.

You will be prompted with the option to create a `Default` or `Custom` table and if this table should or not use the `Unique Draw` feature.

When using that macro, the table will be created into your world with an obvious name and its UUID will also automatically be added to the settings.

## Remove Hero Actions

![](./readme/remove.webp)

A macro has been added to the compendium to help you remove all the actions present on the `Characters` of your world.

You will be prompted with the list of the `Characters` from whom you want the actions to be removed.

# API

A set of functions is exposed from the module to be used by third parties:

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
 * @param {string} uuid
 * @returns {Promise<{name: string, description: string} | undefined>} the description of the item if found
 */
function getHeroActionDetails(uuid: string) => Promise<{name: string, description: string} | undefined>
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

```js
/**
 * returns null if an handled error occured (displaying a notification)
 * @returns {Promise<{ uuid: string; name: any } | null | undefined>}
 */
function drawHeroAction: () => Promise<{ uuid: string; name: any } | null | undefined>
```

```js
/**
 * Will draw the missing action for the character
 * Displaying a ChatMessage with the details
 * @param {CharacterPF2e} actor
 */
function drawHeroActions: (actor: CharacterPF2e) => Promise<void>
```

```js
/**
 * @param {CharacterPF2e} actor
 * @param {ItemUUID} uuid
 */
function sendActionToChat: (actor: CharacterPF2e, uuid: ItemUUID) => Promise<void>
```

```js
/**
 * @param {CharacterPF2e} actor
 * @param {ItemUUID | ItemUUID[]} uuids
 */
function discardHeroActions: (actor: CharacterPF2e, uuids: ItemUUID | ItemUUID[])=> Promise<void>
```

```js
/**
 * Will open a trade dialog
 * @param {CharacterPF2e} actor
 */
function tradeHeroAction: (actor: CharacterPF2e) => void
```

# CHANGELOG

You can see the changelog [HERE](./CHANGELOG.md)
