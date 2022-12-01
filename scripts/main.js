var $1623e5e7c705b7c7$export$2e2bcd8739ae039 = "pf2e-hero-actions";


function $f13521bdeed07ab3$export$90835e7e06f4e75b(id) {
    return game.modules.get(id);
}
function $f13521bdeed07ab3$export$afac0fc6c5fe0d6() {
    return $f13521bdeed07ab3$export$90835e7e06f4e75b((0, $1623e5e7c705b7c7$export$2e2bcd8739ae039));
}
function $f13521bdeed07ab3$export$d60ce5b76fc8cf55(id) {
    return $f13521bdeed07ab3$export$90835e7e06f4e75b(id)?.api;
}




function $ee65ef5b7d5dd2ef$export$f6ed52839c6955bc(...path) {
    return `${0, $1623e5e7c705b7c7$export$2e2bcd8739ae039}.settings.${path.join(".")}`;
}
function $ee65ef5b7d5dd2ef$export$79b67f6e2f31449(...path) {
    return `flags.${0, $1623e5e7c705b7c7$export$2e2bcd8739ae039}.${path.join("/")}`;
}
function $ee65ef5b7d5dd2ef$export$bdd507c72609c24e(...path) {
    return `modules/${0, $1623e5e7c705b7c7$export$2e2bcd8739ae039}/templates/${path.join("/")}`;
}


function $b29eb7e0eb12ddbc$export$8206e8d612b3e63(key) {
    return game.settings.get((0, $1623e5e7c705b7c7$export$2e2bcd8739ae039), key);
}
function $b29eb7e0eb12ddbc$export$61fd6f1ddd0c20e2(key, value) {
    return game.settings.set((0, $1623e5e7c705b7c7$export$2e2bcd8739ae039), key, value);
}
function $b29eb7e0eb12ddbc$export$3bfe3819d89751f0(options) {
    const name = options.name;
    options.scope = options.scope ?? "world";
    options.config = options.config ?? false;
    if (options.config) {
        options.name = (0, $ee65ef5b7d5dd2ef$export$f6ed52839c6955bc)(name, "name");
        options.hint = (0, $ee65ef5b7d5dd2ef$export$f6ed52839c6955bc)(name, "hint");
    }
    game.settings.register((0, $1623e5e7c705b7c7$export$2e2bcd8739ae039), name, options);
}
function $b29eb7e0eb12ddbc$export$cd2f7161e4d70860(options) {
    const name = options.name;
    options.name = (0, $ee65ef5b7d5dd2ef$export$f6ed52839c6955bc)("menus", name, "name");
    options.label = (0, $ee65ef5b7d5dd2ef$export$f6ed52839c6955bc)("menus", name, "label");
    options.hint = (0, $ee65ef5b7d5dd2ef$export$f6ed52839c6955bc)("menus", name, "hint");
    options.restricted = options.restricted ?? true;
    options.icon = options.icon ?? "fas fa-cogs";
    game.settings.registerMenu((0, $1623e5e7c705b7c7$export$2e2bcd8739ae039), name, options);
}



const $90eb2d5b4bfcd8b9$var$CAMEL_CASE_REGEX = /[_ -]+([a-zA-Z0-9])/g;
const $90eb2d5b4bfcd8b9$var$SNAKE_CASE_REGEX = / +/g;
function $90eb2d5b4bfcd8b9$export$9a00dee1beb8f576(str) {
    if (!str) return "";
    return str[0].toUpperCase() + str.slice(1);
}
function $90eb2d5b4bfcd8b9$export$8a7688a96d852767(str) {
    return str.replace($90eb2d5b4bfcd8b9$var$CAMEL_CASE_REGEX, (_, c)=>c.toUpperCase());
}
function $90eb2d5b4bfcd8b9$export$feae9a740c003485(str) {
    return str.toLowerCase().replace($90eb2d5b4bfcd8b9$var$SNAKE_CASE_REGEX, "-");
}


function $df27718be4198c7c$export$6c37cca2e10544cd(name, fn) {
    if (Handlebars.helpers[name]) return;
    Handlebars.registerHelper(name, fn);
}
function $df27718be4198c7c$export$a4dc1d8054f0768() {
    const name = (0, $90eb2d5b4bfcd8b9$export$8a7688a96d852767)((0, $1623e5e7c705b7c7$export$2e2bcd8739ae039));
    $df27718be4198c7c$export$6c37cca2e10544cd(name, function(key, options) {
        key = `${0, $1623e5e7c705b7c7$export$2e2bcd8739ae039}.templates.${key}`;
        const data = options.hash;
        return isEmpty(data) ? game.i18n.localize(key) : game.i18n.format(key, data);
    });
}



function $7d0b581a56a65cc7$export$38fd5ae0f7102bdb(callback) {
    game.socket.on(`module.${(0, $1623e5e7c705b7c7$export$2e2bcd8739ae039)}`, callback);
}
function $7d0b581a56a65cc7$export$a2c1d094f400f44a(packet) {
    game.socket.emit(`module.${(0, $1623e5e7c705b7c7$export$2e2bcd8739ae039)}`, packet);
}



function $53cf1f1c9c92715e$export$eb8e976fd8646538(doc) {
    // @ts-ignore
    return !!doc.flags && (0, $1623e5e7c705b7c7$export$2e2bcd8739ae039) in doc.flags;
}
function $53cf1f1c9c92715e$export$a19b74191e00c5e(doc, key, ...keys) {
    keys.unshift(key);
    return doc.getFlag((0, $1623e5e7c705b7c7$export$2e2bcd8739ae039), keys.join("."));
}
function $53cf1f1c9c92715e$export$5e165df1e30a1331(doc, key, value) {
    return doc.setFlag((0, $1623e5e7c705b7c7$export$2e2bcd8739ae039), key, value);
}



function $889355b5c39241f1$export$b3bd0bc58e36cd63(key, data) {
    key = `${0, $1623e5e7c705b7c7$export$2e2bcd8739ae039}.${key}`;
    if (data) return game.i18n.format(key, data);
    return game.i18n.localize(key);
}
function $889355b5c39241f1$export$a2435eff6fb7f6c1(subKey) {
    return (key, data)=>$889355b5c39241f1$export$b3bd0bc58e36cd63(`${subKey}.${key}`, data);
}



function $d20bc07084c62caf$export$5e14cdade93d6f7b(str, arg1, arg2, arg3) {
    const type = typeof arg1 === "string" ? arg1 : "info";
    const data = typeof arg1 === "object" ? arg1 : typeof arg2 === "object" ? arg2 : undefined;
    const permanent = typeof arg1 === "boolean" ? arg1 : typeof arg2 === "boolean" ? arg2 : arg3 ?? false;
    ui.notifications.notify((0, $889355b5c39241f1$export$b3bd0bc58e36cd63)(str, data), type, {
        permanent: permanent
    });
}
function $d20bc07084c62caf$export$c106dd0671a0fc2d(str, arg1, arg2) {
    $d20bc07084c62caf$export$5e14cdade93d6f7b(str, "warning", arg1, arg2);
}
function $d20bc07084c62caf$export$a80b3bd66acc52ff(str, arg1, arg2) {
    $d20bc07084c62caf$export$5e14cdade93d6f7b(str, "info", arg1, arg2);
}
function $d20bc07084c62caf$export$a3bc9b8ed74fc(str, arg1, arg2) {
    $d20bc07084c62caf$export$5e14cdade93d6f7b(str, "error", arg1, arg2);
}




function $3b07b3ae0f2d41b7$export$54f992c69bf0c22c(result) {
    if (result.type === CONST.TABLE_RESULT_TYPES.DOCUMENT) return `${result.documentCollection}.${result.documentId}`;
    if (result.type === CONST.TABLE_RESULT_TYPES.COMPENDIUM) return `Compendium.${result.documentCollection}.${result.documentId}`;
    return undefined;
}
function $3b07b3ae0f2d41b7$export$20ab79f56cb5e678(uuid, name) {
    if (name) return `@UUID[${uuid}]{${name}}`;
    return `@UUID[${uuid}]`;
}


const $d646a5465ba01f71$var$DECK_PACK = "pf2e.hero-point-deck";
const $d646a5465ba01f71$var$TABLE_PACK = "pf2e.rollable-tables";
const $d646a5465ba01f71$var$TABLE_ID = "zgZoI7h0XjjJrrNK";
const $d646a5465ba01f71$var$TABLE_UUID = `Compendium.${$d646a5465ba01f71$var$TABLE_PACK}.${$d646a5465ba01f71$var$TABLE_ID}`;
const $d646a5465ba01f71$var$ICON = "systems/pf2e/icons/features/feats/heroic-recovery.webp";
async function $d646a5465ba01f71$var$getTableFromUuid(uuid) {
    if (!uuid) return undefined;
    const table = await fromUuid(uuid);
    return table && table instanceof RollTable ? table : undefined;
}
async function $d646a5465ba01f71$export$34d0094ffc0e15f2() {
    return /** @type {Promise<RollTable>} */ $d646a5465ba01f71$var$getTableFromUuid($d646a5465ba01f71$var$TABLE_UUID);
}
async function $d646a5465ba01f71$export$f5812c397f4129c1() {
    return game.tables.find((x)=>x.getFlag("core", "sourceId") === $d646a5465ba01f71$var$TABLE_UUID);
}
async function $d646a5465ba01f71$export$2d9dd1caf0db9037() {
    return $d646a5465ba01f71$var$getTableFromUuid((0, $b29eb7e0eb12ddbc$export$8206e8d612b3e63)("tableUUID"));
}
async function $d646a5465ba01f71$export$d5edccdc32c00904() {
    return await $d646a5465ba01f71$export$2d9dd1caf0db9037() ?? await $d646a5465ba01f71$export$f5812c397f4129c1() ?? await $d646a5465ba01f71$export$34d0094ffc0e15f2();
}
function $d646a5465ba01f71$export$ca0ac072ddfd6d2c(actor) {
    const actions = (0, $53cf1f1c9c92715e$export$a19b74191e00c5e)(actor, "heroActions") ?? [];
    const pack = game.packs.get($d646a5465ba01f71$var$DECK_PACK);
    return actions.map((action)=>{
        if (typeof action !== "string") return action;
        if (!pack) return undefined;
        const entry = pack.index.get(action);
        if (!entry) return undefined;
        return {
            name: entry.name,
            uuid: `Compendium.${$d646a5465ba01f71$var$DECK_PACK}.${entry._id}`
        };
    }).filter((x)=>x);
}
async function $d646a5465ba01f71$export$eae9a14e6f1ee538(actor, uuid) {
    const points = actor.heroPoints.value;
    if (points < 1) return (0, $d20bc07084c62caf$export$c106dd0671a0fc2d)("use.noPoints");
    const actions = $d646a5465ba01f71$export$ca0ac072ddfd6d2c(actor);
    const index = actions.findIndex((x)=>x.uuid === uuid);
    if (index === -1) return;
    const details = await $d646a5465ba01f71$export$5b3b73a115a637d0(uuid);
    if (!details) (0, $d20bc07084c62caf$export$a3bc9b8ed74fc)("use.noDetails");
    actions.splice(index, 1);
    if (details) {
        actor.update({
            ["system.resources.heroPoints.value"]: points - 1,
            [(0, $ee65ef5b7d5dd2ef$export$79b67f6e2f31449)("heroActions")]: actions
        });
        ChatMessage.create({
            flavor: `<h4 class="action">${(0, $889355b5c39241f1$export$b3bd0bc58e36cd63)("actions-use.header")}</h4>`,
            content: `<h2>${details.name}</h2>${details.description}`,
            speaker: ChatMessage.getSpeaker({
                actor: actor
            })
        });
    } else (0, $53cf1f1c9c92715e$export$5e165df1e30a1331)(actor, "heroActions", actions);
}
async function $d646a5465ba01f71$export$5b3b73a115a637d0(uuid) {
    const document = await fromUuid(uuid);
    if (!(document instanceof JournalEntry)) return undefined;
    const page = document.pages.contents[0];
    let text = page.text.content;
    if (text && document.pack === $d646a5465ba01f71$var$DECK_PACK) text = text.replace(/^<p>/, "<p><strong>Trigger</strong> ");
    return text ? {
        name: document.name,
        description: text
    } : undefined;
}
function $d646a5465ba01f71$export$2af089cfea88bff8(actor, actions) {
    return (0, $53cf1f1c9c92715e$export$5e165df1e30a1331)(actor, "heroActions", actions);
}
function $d646a5465ba01f71$export$2d554aa9f1665e09(unique = true, table) {
    const source = {
        name: (0, $889355b5c39241f1$export$b3bd0bc58e36cd63)("table.name"),
        replacement: !unique,
        img: $d646a5465ba01f71$var$ICON,
        description: (0, $889355b5c39241f1$export$b3bd0bc58e36cd63)("table.description")
    };
    if (!table) return source;
    return mergeObject(duplicate(table._source), source);
}
async function $d646a5465ba01f71$export$c3a6fc7ed68f1ff5(unique = true) {
    const table = await fromUuid($d646a5465ba01f71$var$TABLE_UUID);
    const source = $d646a5465ba01f71$export$2d554aa9f1665e09(unique, table);
    return RollTable.create(source, {
        temporary: false
    });
}
function $d646a5465ba01f71$export$8bd70de60a58c98a(unique = true) {
    const source = $d646a5465ba01f71$export$2d554aa9f1665e09(unique);
    return RollTable.create(source, {
        temporary: false
    });
}
async function $d646a5465ba01f71$export$ef847b546007c96a() {
    const table = await $d646a5465ba01f71$export$d5edccdc32c00904();
    if (!table) {
        (0, $d20bc07084c62caf$export$a3bc9b8ed74fc)("table.drawError", true);
        return null;
    }
    if (!table.formula) {
        if (game.user.isGM) {
            if (table.compendium) {
                (0, $d20bc07084c62caf$export$a3bc9b8ed74fc)("table.noFormulaCompendium", true);
                return null;
            }
            await table.normalize();
        } else {
            (0, $d20bc07084c62caf$export$a3bc9b8ed74fc)("table.noFormula", true);
            return null;
        }
    }
    if (table.replacement) {
        const drawn = table.results.filter((r)=>!r.drawn);
        if (!drawn.length) await table.resetResults();
    }
    const draw = (await table.draw({
        displayChat: false
    })).results[0];
    const uuid = (0, $3b07b3ae0f2d41b7$export$54f992c69bf0c22c)(draw);
    if (uuid) return {
        uuid: uuid,
        name: draw.text
    };
    return undefined;
}








const $e2e1ea6dd3b7d2e1$export$b4a3a1c0b9c3227d = "Compendium.pf2e-hero-actions.macros.SUXi4nhdJb8vZk58";
const $e2e1ea6dd3b7d2e1$var$localizeChoice = (0, $889355b5c39241f1$export$a2435eff6fb7f6c1)("templates.createTable.choice");
const $e2e1ea6dd3b7d2e1$var$localizeDefaultConfirm = (0, $889355b5c39241f1$export$a2435eff6fb7f6c1)("templates.createTable.default.confirm");
const $e2e1ea6dd3b7d2e1$var$localizeRemove = (0, $889355b5c39241f1$export$a2435eff6fb7f6c1)("templates.removeActions");
async function $e2e1ea6dd3b7d2e1$export$b99f288ff121376e() {
    const template = (0, $ee65ef5b7d5dd2ef$export$bdd507c72609c24e)("dialogs/remove-actions.html");
    const buttons = {
        yes: {
            label: $e2e1ea6dd3b7d2e1$var$localizeRemove("remove"),
            icon: '<i class="fas fa-trash"></i>',
            callback: (html)=>html.find('input[name="actor"]:checked').toArray().map((x)=>game.actors.get(x.value)).filter((x)=>x)
        },
        no: {
            label: $e2e1ea6dd3b7d2e1$var$localizeRemove("cancel"),
            icon: '<i class="fas fa-times"></i>',
            callback: ()=>[]
        }
    };
    const data = {
        content: await renderTemplate(template, {
            actors: game.actors.filter((x)=>x.type === "character")
        }),
        title: $e2e1ea6dd3b7d2e1$var$localizeRemove("title"),
        buttons: buttons,
        default: "yes",
        render: (html)=>{
            html.on("change", 'input[name="all"]', ()=>$e2e1ea6dd3b7d2e1$var$removeActionsToggleAll(html));
            html.on("change", 'input[name="actor"]', ()=>$e2e1ea6dd3b7d2e1$var$removeActionsToggleActor(html));
        },
        close: ()=>[]
    };
    const actors = await Dialog.wait(data, undefined, {
        id: "pf2e-hero-actions-remove-actions"
    });
    if (!actors.length) return (0, $d20bc07084c62caf$export$c106dd0671a0fc2d)("templates.removeActions.noSelection");
    for (const actor of actors)await (0, $53cf1f1c9c92715e$export$5e165df1e30a1331)(actor, "heroActions", []);
    (0, $d20bc07084c62caf$export$a80b3bd66acc52ff)("templates.removeActions.removed");
}
function $e2e1ea6dd3b7d2e1$var$removeActionsToggleAll(html) {
    const state = html.find('input[name="all"]')[0].checked;
    html.find('input[name="actor"]').prop("checked", state);
}
function $e2e1ea6dd3b7d2e1$var$removeActionsToggleActor(html) {
    const actors = html.find('input[name="actor"]');
    const checked = actors.filter(":checked");
    const all = html.find('input[name="all"]');
    if (actors.length === checked.length) {
        all.prop("checked", true).prop("indeterminate", false);
        actors.prop("checked", true);
    } else if (!checked.length) {
        all.prop("checked", false).prop("indeterminate", false);
        actors.prop("checked", false);
    } else all.prop("checked", false).prop("indeterminate", true);
}
async function $e2e1ea6dd3b7d2e1$export$33bbb3ec7652e187() {
    const template = (0, $ee65ef5b7d5dd2ef$export$bdd507c72609c24e)("dialogs/create-table.html");
    const buttons = {
        yes: {
            label: $e2e1ea6dd3b7d2e1$var$localizeChoice("create"),
            icon: '<i class="fas fa-border-all"></i>',
            callback: (html)=>{
                const type = html.find('.window-content input[name="type"]:checked').val();
                const unique = html.find('.window-content input[name="draw"]:checked').val() === "unique";
                return {
                    type: type,
                    unique: unique
                };
            }
        },
        no: {
            label: $e2e1ea6dd3b7d2e1$var$localizeChoice("cancel"),
            icon: '<i class="fas fa-times"></i>',
            callback: ()=>null
        }
    };
    /** @type {DialogData} */ const data = {
        content: await renderTemplate(template),
        title: $e2e1ea6dd3b7d2e1$var$localizeChoice("title"),
        buttons: buttons,
        default: "yes",
        close: ()=>null
    };
    const result = await Dialog.wait(data, undefined, {
        id: "pf2e-hero-actions-create-table"
    });
    if (!result) return;
    if (result.type === "default") $e2e1ea6dd3b7d2e1$var$createDefaultTable(result.unique);
    else $e2e1ea6dd3b7d2e1$var$createCustomTable(result.unique);
}
async function $e2e1ea6dd3b7d2e1$var$createDefaultTable(unique) {
    let table = await (0, $d646a5465ba01f71$export$f5812c397f4129c1)();
    if (table) {
        const override = await Dialog.confirm({
            title: $e2e1ea6dd3b7d2e1$var$localizeDefaultConfirm("title"),
            content: $e2e1ea6dd3b7d2e1$var$localizeDefaultConfirm("content")
        });
        if (override) {
            const update = (0, $d646a5465ba01f71$export$2d554aa9f1665e09)(unique);
            await table.update(update);
            return $e2e1ea6dd3b7d2e1$var$setTable(table, true);
        }
    }
    table = await (0, $d646a5465ba01f71$export$c3a6fc7ed68f1ff5)(unique);
    await $e2e1ea6dd3b7d2e1$var$setTable(table);
}
async function $e2e1ea6dd3b7d2e1$var$createCustomTable(unique) {
    const table = await (0, $d646a5465ba01f71$export$8bd70de60a58c98a)(unique);
    await $e2e1ea6dd3b7d2e1$var$setTable(table);
    table.sheet?.render(true);
}
async function $e2e1ea6dd3b7d2e1$var$setTable(table, normalize = false) {
    if (normalize) await table.normalize();
    await (0, $b29eb7e0eb12ddbc$export$61fd6f1ddd0c20e2)("tableUUID", table.uuid);
}









function $2498048dd39926c2$export$99925ce9e702f588(actor, linkedOnly = false) {
    return game.scenes.map((scene)=>scene.tokens.filter((token)=>token.actorId === actor.id && (!linkedOnly || token.actorLink))).flat();
}
function $2498048dd39926c2$export$b64e7dcb984d6faa(actor, connected = false) {
    if (connected) return game.users.find((x)=>x.active && x.character === actor);
    return game.users.find((x)=>x.character === actor);
}





function $d3c956a52a17449c$export$7d75da6d34f1a955() {
    const data = game.data;
    const user = data.users.find((x)=>x._id === data.userId);
    return !!user && user.role >= CONST.USER_ROLES.GAMEMASTER;
}
function $d3c956a52a17449c$export$148de59b68ce26ae(doc, connected = false) {
    if (connected) return game.users.filter((x)=>x.active && doc.testUserPermission(x, "OWNER"));
    return game.users.filter((x)=>doc.testUserPermission(x, "OWNER"));
}
function $d3c956a52a17449c$export$5f4ed0d56c2c0edf(doc, connected = false) {
    if (connected) return game.users.find((x)=>x.active && doc.testUserPermission(x, "OWNER"));
    return game.users.find((x)=>doc.testUserPermission(x, "OWNER"));
}
function $d3c956a52a17449c$export$31d9ed870e9f0a1d(connected = false) {
    if (connected) return game.users.find((x)=>x.active && x.isGM);
    return game.users.find((x)=>x.isGM);
}








async function $02a23761e1ffd9af$export$6a3127c2821a7fad(trade) {
    const { sender: sender , receiver: receiver  } = trade;
    const senderActor = game.actors.get(sender.cid);
    const receiverActor = game.actors.get(receiver.cid);
    if (!senderActor || !receiverActor) {
        $02a23761e1ffd9af$var$sendTradeError(trade);
        return;
    }
    let content = `<p>${(0, $889355b5c39241f1$export$b3bd0bc58e36cd63)("trade-request.header", {
        sender: senderActor.name,
        receiver: receiverActor.name
    })}</p>`;
    content += `<p>${(0, $889355b5c39241f1$export$b3bd0bc58e36cd63)("trade-request.give", {
        give: (0, $3b07b3ae0f2d41b7$export$20ab79f56cb5e678)(sender.uuid)
    })}</p>`;
    content += `<p>${(0, $889355b5c39241f1$export$b3bd0bc58e36cd63)("trade-request.want", {
        want: (0, $3b07b3ae0f2d41b7$export$20ab79f56cb5e678)(receiver.uuid)
    })}</p>`;
    content += `<p style="margin-bottom: 1em;">${(0, $889355b5c39241f1$export$b3bd0bc58e36cd63)("trade-request.accept")}</p>`;
    const accept = await Dialog.confirm({
        title: (0, $889355b5c39241f1$export$b3bd0bc58e36cd63)("trade-request.title"),
        content: await TextEditor.enrichHTML(content, {
            async: true
        })
    });
    if (accept) $02a23761e1ffd9af$var$acceptRequest(trade);
    else $02a23761e1ffd9af$var$rejectRequest(trade);
}
async function $02a23761e1ffd9af$export$1aa167b03a63f5ee(trade) {
    const { sender: sender , receiver: receiver  } = trade;
    const senderActor = game.actors.get(sender.cid);
    const receiverActor = game.actors.get(receiver.cid);
    if (!senderActor || !receiverActor) {
        $02a23761e1ffd9af$var$sendTradeError(trade);
        return;
    }
    const senderActions = (0, $53cf1f1c9c92715e$export$a19b74191e00c5e)(senderActor, "heroActions") ?? [];
    const receiverActions = (0, $53cf1f1c9c92715e$export$a19b74191e00c5e)(receiverActor, "heroActions") ?? [];
    const senderActionIndex = senderActions.findIndex((x)=>x.uuid === sender.uuid);
    const receiverActionIndex = receiverActions.findIndex((x)=>x.uuid === receiver.uuid);
    if (senderActionIndex === -1 || receiverActionIndex === -1) {
        $02a23761e1ffd9af$var$sendTradeError(trade);
        return;
    }
    const senderAction = senderActions.splice(senderActionIndex, 1)[0];
    const receiverAction = receiverActions.splice(receiverActionIndex, 1)[0];
    senderActions.push(receiverAction);
    receiverActions.push(senderAction);
    (0, $53cf1f1c9c92715e$export$5e165df1e30a1331)(senderActor, "heroActions", senderActions);
    (0, $53cf1f1c9c92715e$export$5e165df1e30a1331)(receiverActor, "heroActions", receiverActions);
    let content = `<div>${(0, $889355b5c39241f1$export$b3bd0bc58e36cd63)("trade-success.offer", {
        offer: (0, $3b07b3ae0f2d41b7$export$20ab79f56cb5e678)(senderAction.uuid)
    })}</div>`;
    content += `<div>${(0, $889355b5c39241f1$export$b3bd0bc58e36cd63)("trade-success.receive", {
        receive: (0, $3b07b3ae0f2d41b7$export$20ab79f56cb5e678)(receiverAction.uuid)
    })}</div>`;
    ChatMessage.create({
        flavor: `<h4 class="action">${(0, $889355b5c39241f1$export$b3bd0bc58e36cd63)("trade-success.header", {
            name: receiverActor.name
        })}</h4>`,
        content: content,
        speaker: ChatMessage.getSpeaker({
            actor: senderActor
        })
    });
}
async function $02a23761e1ffd9af$export$ae035ff304ec8a6c({ receiver: receiver  }) {
    const actor = game.actors.get(receiver.cid);
    (0, $d20bc07084c62caf$export$c106dd0671a0fc2d)("trade-rejected", {
        name: actor.name
    }, true);
}
function $02a23761e1ffd9af$export$5b9507fcc2c5d2b(err) {
    (0, $d20bc07084c62caf$export$a3bc9b8ed74fc)("trade-error");
}
function $02a23761e1ffd9af$export$75051315b78968b8(trade) {
    if (trade.receiver.id === game.user.id) {
        $02a23761e1ffd9af$var$acceptRequest(trade);
        return;
    }
    (0, $7d0b581a56a65cc7$export$a2c1d094f400f44a)({
        ...trade,
        type: "trade-request"
    });
}
function $02a23761e1ffd9af$var$rejectRequest(trade) {
    if (trade.sender.id === game.user.id) {
        $02a23761e1ffd9af$export$ae035ff304ec8a6c(trade);
        return;
    }
    (0, $7d0b581a56a65cc7$export$a2c1d094f400f44a)({
        ...trade,
        type: "trade-reject"
    });
}
function $02a23761e1ffd9af$var$acceptRequest(trade) {
    if (game.user.isGM) {
        $02a23761e1ffd9af$export$1aa167b03a63f5ee(trade);
        return;
    }
    (0, $7d0b581a56a65cc7$export$a2c1d094f400f44a)({
        ...trade,
        type: "trade-accept"
    });
}
function $02a23761e1ffd9af$var$sendTradeError({ sender: sender , receiver: receiver  }, error = "trade-error") {
    const users = new Set([
        sender.id,
        receiver.id
    ]);
    if (users.has(game.user.id)) {
        users.delete(game.user.id);
        $02a23761e1ffd9af$export$5b9507fcc2c5d2b(error);
    }
    if (!users.size) return;
    (0, $7d0b581a56a65cc7$export$a2c1d094f400f44a)({
        type: "trade-error",
        users: Array.from(users),
        error: error
    });
}


class $1607618259468935$export$366210f9de782ba6 extends Application {
    constructor(actor){
        super({
            id: `pf2e-hero-actions-trade-${actor.id}`
        });
        this._actor = actor;
    }
    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            title: (0, $889355b5c39241f1$export$b3bd0bc58e36cd63)("templates.trade.title"),
            template: (0, $ee65ef5b7d5dd2ef$export$bdd507c72609c24e)("trade.html"),
            width: 600,
            height: "auto"
        });
    }
    get actor() {
        return this._actor;
    }
    get target() {
        return this._target;
    }
    set target(value) {
        if (!value) {
            (0, $d20bc07084c62caf$export$a3bc9b8ed74fc)("templates.trade.no-target");
            return;
        }
        if (value === this._target) return;
        delete this.target?.apps?.[this.appId];
        this._target = value;
        this.render();
    }
    getData(options) {
        return mergeObject(super.getData(), {
            actor: this.actor,
            target: this.target,
            targets: game.actors.filter((x)=>x.type === "character" && x.id !== this.actor.id && x.hasPlayerOwner),
            actions: (0, $d646a5465ba01f71$export$ca0ac072ddfd6d2c)(this.actor),
            targetActions: this.target ? (0, $d646a5465ba01f71$export$ca0ac072ddfd6d2c)(this.target) : []
        });
    }
    activateListeners(html) {
        super.activateListeners(html);
        html.find('select[name="target"]').on("change", this.#onChangeTarget.bind(this));
        html.find('[data-action="description"]').on("click", this.#onDescription.bind(this));
        html.find('[data-action="trade"]').on("click", this.#onSendTrade.bind(this));
        html.find('[data-action="cancel"]').on("click", ()=>this.close());
    }
    render(force, options) {
        this.actor.apps[this.appId] = this;
        if (this.target) this.target.apps[this.appId] = this;
        return super.render(force, options);
    }
    async close(options) {
        await super.close(options);
        delete this.actor.apps?.[this.appId];
        delete this.target?.apps?.[this.appId];
    }
    #onSendTrade() {
        if (!this.target) {
            (0, $d20bc07084c62caf$export$c106dd0671a0fc2d)("templates.trade.no-target");
            return;
        }
        const action = this.element.find('[name="action"]:checked').val();
        const target = this.element.find('[name="targetAction"]:checked').val();
        if (typeof action !== "string" || typeof target !== "string") {
            (0, $d20bc07084c62caf$export$c106dd0671a0fc2d)("templates.trade.no-select");
            return;
        }
        let user = (0, $2498048dd39926c2$export$b64e7dcb984d6faa)(this.target, true) ?? (0, $d3c956a52a17449c$export$5f4ed0d56c2c0edf)(this.target, true) ?? (0, $d3c956a52a17449c$export$31d9ed870e9f0a1d)(true);
        if (!user) {
            (0, $d20bc07084c62caf$export$c106dd0671a0fc2d)("templates.trade.no-user");
            return;
        }
        (0, $02a23761e1ffd9af$export$75051315b78968b8)({
            sender: {
                id: game.user.id,
                cid: this.actor.id,
                uuid: action
            },
            receiver: {
                id: user.id,
                cid: this.target.id,
                uuid: target
            }
        });
        this.close();
    }
    async #onDescription(event) {
        const uuid = $(event.currentTarget).siblings("input").val();
        const entry = await fromUuid(uuid);
        entry?.sheet.render(true);
    }
    #onChangeTarget(event1) {
        const id = event1.currentTarget.value;
        this.target = game.actors.get(id);
    }
}


async function $026f2657de0e8ef5$export$acdcee5510fda048(sheet, $html) {
    const actor = sheet.actor;
    if (actor.pack || !actor.id || !game.actors.has(actor.id)) return;
    await $026f2657de0e8ef5$var$addHeroActions($html, actor);
    $026f2657de0e8ef5$var$addEvents($html, actor);
}
async function $026f2657de0e8ef5$var$addHeroActions(html, actor) {
    const actions = (0, $d646a5465ba01f71$export$ca0ac072ddfd6d2c)(actor);
    const diff = actor.heroPoints.value - actions.length;
    const isOwner = actor.isOwner;
    const template = await renderTemplate((0, $ee65ef5b7d5dd2ef$export$bdd507c72609c24e)("sheet.html"), {
        owner: isOwner,
        list: actions,
        canUse: diff >= 0 && isOwner,
        canDraw: diff > 0 && isOwner,
        canTrade: (0, $b29eb7e0eb12ddbc$export$8206e8d612b3e63)("trade"),
        mustDiscard: diff < 0,
        diff: Math.abs(diff)
    });
    html.find('.tab[data-tab="actions"] .actions-panel[data-tab="encounter"] > .strikes-list:not(.skill-action-list)').first().after(template);
}
function $026f2657de0e8ef5$var$addEvents(html, actor) {
    const $list = html.find(".tab.actions .heroActions-list");
    $list.find("[data-action=draw]").on("click", (event)=>$026f2657de0e8ef5$var$onClickHeroActionsDraw(actor, event));
    $list.find("[data-action=expand]").on("click", $026f2657de0e8ef5$var$onClickHeroActionExpand);
    $list.find("[data-action=use]").on("click", (event)=>$026f2657de0e8ef5$var$onClickHeroActionUse(actor, event));
    $list.find("[data-action=display]").on("click", (event)=>$026f2657de0e8ef5$var$onClickHeroActionDisplay(actor, event));
    $list.find("[data-action=discard]").on("click", $026f2657de0e8ef5$var$onClickHeroActionDiscard);
    $list.find("[data-action=discard-selected]").on("click", ()=>$026f2657de0e8ef5$var$onClickHeroActionsDiscard(actor, html));
    html.find("[data-action=hero-actions-trade]").on("click", ()=>$026f2657de0e8ef5$var$onClickHeroActionsTrade(actor));
}
function $026f2657de0e8ef5$var$onClickHeroActionsTrade(actor) {
    const actions = (0, $53cf1f1c9c92715e$export$a19b74191e00c5e)(actor, "heroActions");
    if (!actions || !actions.length) {
        (0, $d20bc07084c62caf$export$c106dd0671a0fc2d)("no-action");
        return;
    }
    const diff = actions.length - actor.heroPoints.value;
    if (diff > 0) {
        (0, $d20bc07084c62caf$export$c106dd0671a0fc2d)("no-points", {
            nb: diff.toString()
        });
        return;
    }
    new (0, $1607618259468935$export$366210f9de782ba6)(actor).render(true);
}
async function $026f2657de0e8ef5$var$onClickHeroActionExpand(event) {
    event.preventDefault();
    const $action = $(event.currentTarget).closest(".action");
    const $summary = $action.find(".item-summary");
    if (!$summary.hasClass("loaded")) {
        const uuid = $action.attr("data-uuid");
        const details = await (0, $d646a5465ba01f71$export$5b3b73a115a637d0)(uuid);
        if (!details) return;
        const text = await TextEditor.enrichHTML(details.description, {
            async: true
        });
        $summary.find(".item-description").html(text);
        $summary.addClass("loaded");
    }
    $action.toggleClass("expanded");
}
async function $026f2657de0e8ef5$var$onClickHeroActionDisplay(actor, event) {
    event.preventDefault();
    const uuid = $(event.currentTarget).closest(".action").attr("data-uuid");
    const details = await (0, $d646a5465ba01f71$export$5b3b73a115a637d0)(uuid);
    if (!details) return (0, $d20bc07084c62caf$export$a3bc9b8ed74fc)("details.missing");
    ChatMessage.create({
        content: `<h2>${details.name}</h2>${details.description}`,
        speaker: ChatMessage.getSpeaker({
            actor: actor
        })
    });
}
function $026f2657de0e8ef5$var$onClickHeroActionDiscard(event) {
    event.preventDefault();
    const action = $(event.currentTarget).closest(".action");
    const list = action.closest(".heroActions-list");
    action.toggleClass("discarded");
    const toDiscard = Number(list.attr("data-discard") ?? "0");
    const $discarded = list.find(".action.discarded");
    list.toggleClass("discardable", $discarded.length === toDiscard);
}
async function $026f2657de0e8ef5$var$onClickHeroActionsDiscard(actor, html) {
    const discarded = html.find(".tab.actions .heroActions-list .action.discarded");
    const uuids = discarded.toArray().map((x)=>x.dataset.uuid);
    const actions = (0, $d646a5465ba01f71$export$ca0ac072ddfd6d2c)(actor);
    const removed = /** @type {HeroAction[]} */ [];
    for (const uuid of uuids){
        const index = actions.findIndex((x)=>x.uuid === uuid);
        if (index === -1) continue;
        removed.push(actions[index]);
        actions.splice(index, 1);
    }
    (0, $d646a5465ba01f71$export$2af089cfea88bff8)(actor, actions);
    const display = removed.map((x)=>(0, $3b07b3ae0f2d41b7$export$20ab79f56cb5e678)(x.uuid, x.name));
    ChatMessage.create({
        flavor: `<h4 class="action">${(0, $889355b5c39241f1$export$b3bd0bc58e36cd63)("actions-discard.header", {
            nb: display.length
        })}</h4>`,
        content: display.map((x)=>`<div>${x}</div>`).join(""),
        speaker: ChatMessage.getSpeaker({
            actor: actor
        })
    });
}
async function $026f2657de0e8ef5$var$onClickHeroActionsDraw(actor, event) {
    event.preventDefault();
    const actions = (0, $d646a5465ba01f71$export$ca0ac072ddfd6d2c)(actor);
    const nb = actor.heroPoints.value - actions.length;
    const drawn = /** @type {HeroAction[]} */ [];
    for(let i = 0; i < nb; i++){
        const action = await (0, $d646a5465ba01f71$export$ef847b546007c96a)();
        if (action === undefined) continue;
        else if (action === null) return;
        actions.push(action);
        drawn.push(action);
    }
    if (!drawn.length) return;
    (0, $d646a5465ba01f71$export$2af089cfea88bff8)(actor, actions);
    const display = drawn.map((x)=>(0, $3b07b3ae0f2d41b7$export$20ab79f56cb5e678)(x.uuid, x.name));
    ChatMessage.create({
        flavor: `<h4 class="action">${(0, $889355b5c39241f1$export$b3bd0bc58e36cd63)("actions-draw.header", {
            nb: display.length
        })}</h4>`,
        content: display.map((x)=>`<div>${x}</div>`).join(""),
        speaker: ChatMessage.getSpeaker({
            actor: actor
        })
    });
}
async function $026f2657de0e8ef5$var$onClickHeroActionUse(actor, event) {
    event.preventDefault();
    const uuid = $(event.currentTarget).closest(".action").attr("data-uuid");
    (0, $d646a5465ba01f71$export$eae9a14e6f1ee538)(actor, uuid);
}
function $026f2657de0e8ef5$export$837044a00d10fb2c() {
    Object.values(ui.windows).forEach((x)=>{
        if (x instanceof ActorSheet && x.actor.type === "character") x.render(true);
    });
}



Hooks.once("init", ()=>{
    (0, $df27718be4198c7c$export$a4dc1d8054f0768)();
    (0, $b29eb7e0eb12ddbc$export$3bfe3819d89751f0)({
        name: "tableUUID",
        type: String,
        default: "",
        config: true
    });
    (0, $b29eb7e0eb12ddbc$export$3bfe3819d89751f0)({
        name: "trade",
        type: Boolean,
        default: false,
        config: true,
        onChange: (0, $026f2657de0e8ef5$export$837044a00d10fb2c)
    });
});
Hooks.once("ready", ()=>{
    (0, $7d0b581a56a65cc7$export$38fd5ae0f7102bdb)($b013a5dd6d18443e$export$77349932e6536f4d);
    if (!game.user.isGM) return;
    (0, $f13521bdeed07ab3$export$afac0fc6c5fe0d6)().api = {
        createTable: $e2e1ea6dd3b7d2e1$export$33bbb3ec7652e187,
        removeHeroActions: $e2e1ea6dd3b7d2e1$export$b99f288ff121376e,
        getHeroActions: $d646a5465ba01f71$export$ca0ac072ddfd6d2c,
        useHeroAction: $d646a5465ba01f71$export$eae9a14e6f1ee538
    };
});
Hooks.on("renderCharacterSheetPF2e", (0, $026f2657de0e8ef5$export$acdcee5510fda048));
function $b013a5dd6d18443e$export$77349932e6536f4d(packet) {
    switch(packet.type){
        case "trade-reject":
            if (packet.sender.id !== game.user.id) return;
            (0, $02a23761e1ffd9af$export$ae035ff304ec8a6c)(packet);
            break;
        case "trade-accept":
            if (!game.user.isGM) return;
            (0, $02a23761e1ffd9af$export$1aa167b03a63f5ee)(packet);
            break;
        case "trade-request":
            if (packet.receiver.id !== game.user.id) return;
            (0, $02a23761e1ffd9af$export$6a3127c2821a7fad)(packet);
            break;
        case "trade-error":
            if (!packet.users.includes(game.user.id)) return;
            (0, $02a23761e1ffd9af$export$5b9507fcc2c5d2b)(packet.error);
            break;
    }
}


export {$b013a5dd6d18443e$export$77349932e6536f4d as onPacketReceived};
//# sourceMappingURL=main.js.map
