
export type Language = { 
    label: string,
    selector: "pt" | "en"
}

export type TranslateWords = "initial.message"
    | "login.title"
    | "login.message"
    | "register.title"
    | "register.message"

    | "commons.yes"
    | "commons.no"
    | "commons.ok"
    | "commons.open"
    | "commons.close"
    | "commons.exit"
    | "commons.oops"
    | "commons.success"
    | "commons.alert"
    | "commons.error"
    | "commons.search"
    | "commons.signin"
    | "commons.signup"
    | "commons.signout"
    | "commons.enter"
    | "commons.buy"
    | "commons.sell"
    | "commons.send"
    | "commons.scan"
    | "commons.receive"
    | "commons.create"
    | "commons.import"
    | "commons.add"
    | "commons.remove"
    | "commons.update"
    | "commons.delete"
    | "commons.save"
    | "commons.delete.account"
    | "commons.authenticate"
    | "commons.authenticate.message"
    | "commons.detectedkey"
    | "commons.nodescription"
    | "commons.copy"
    | "commons.options"
    | "commons.copied"
    | "commons.name"
    | "commons.description"
    | "commons.version"
    | "commons.hello"
    | "commons.delete-for-me"
    | "commons.delete-for-all"
    | "commons.copy-text"
    | "commons.follow"
    | "commons.unfollow"
    | "commons.filters"
    | "commons.cancel"
    | "commons.details"
    | "commons.invite"

    | "labels.all"
    | "labels.username"
    | "labels.about"
    | "labels.mywebsite"
    | "labels.lnaddress"
    | "labels.friends"
    | "labels.privatekey"
    | "labels.wallet.add"
    | "labels.wallet.name"
    | "labels.wallet.getseed"
    | "labels.wallet.password"
    | "labels.relays.add"

    | "menu.home"
    | "menu.orders"
    | "menu.buy&sell"
    | "menu.donate"
    | "menu.chats"
    | "menu.notifications"
    | "menu.setting"
    | "menu.videos"

    | "message.invalidkey"
    | "message.detectedkey"
    | "message.detectedkey.value"
    | "message.wallet.create"

    | "friends.notes.lasts"
    | "friends.notes.empty"
    | "friends.search.subtitle"
    | "friends.user.is-friend"

    | "settings.relays"
    | "settings.account.edit"
    | "settings.about"
    | "settings.about.content"
    | "settings.nostrkey.copy"
    | "settings.secretkey.copy"
    | "settings.chooselanguage"
    | "settings.security"

    | "section.title.wallets"
    | "section.title.sales"
    | "section.title.transactions"
    | "section.title.transactions.empty"
    | "section.title.frends.empty"
    | "section.title.sharefriend"
    | "section.description.sharefriend"
    | "section.title.talkdevelopers"
    | "section.description.talkdevelopers"
    | "section.title.managefriends"
    | "section.description.managefriends"

    | "message.wallet.alertcreate"
    | "message.wallet.notfound"
    | "message.wallet.nameempty"
    | "message.wallet.invalidseed"
    | "message.wallet.saved"
    | "message.wallet.saveseed"
    | "message.wallet.wantdelete"
    | "message.wallet.alertdelete"
    | "message.transaction.insufficient_funds"
    | "message.transaction.confirmed"
    | "message.transaction.notconfirmed"
    | "message.shortly"
    | "message.error.notaccessgallery"
    | "message.copied"
    | "message.profile.saved"
    | "message.profile.wantleave"
    | "message.profile.alertleave"
    | "message.profile.alertname"
    | "message.request.error"
    | "message.default_error"
    | "message.relay.title_delete"
    | "message.relay.confirm_delete"
    | "message.relay.delete_success"
    | "message.relay.save_success"
    | "message.relay.invalid"
    | "message.relay.invalid_format"
    | "message.relay.already_exists"
    | "message.relay.supported_nips"
    | "message.relay.empty"
    | "message.friend.already"
    | "message.download.successfully"

    | "wallet.lightning.tag"
    | "wallet.lightning.description"
    | "wallet.bitcoin.tag"
    | "wallet.bitcoin.description"
    | "wallet.bitcoin.testnet.tag"
    | "wallet.bitcoin.testnet.description"
    | "wallet.title.receive"
    | "wallet.title.send"
    | "wallet.title.sendvalue"
    | "wallet.title.sendfor"
    | "wallet.title.sendreceiver"
    | "wallet.title.settings"
    | "wallet.title.import"
    | "wallet.subtitle.balance"
    | "wallet.placeholder.addressuser"
    | "wallet.title.seed"
    | "wallet.tag"
    | "wallet.transaction.title"
    | "wallet.transaction.details"
    | "wallet.transaction.fee"
    | "wallet.transaction.date"
    | "wallet.transaction.size"
    | "wallet.transaction.balance"
    | "wallet.transaction.inputs"
    | "wallet.transaction.outputs"
    | "wallet.transaction.block-hight"
    | "wallet.transaction.confirmations"
    | "wallet.transaction.view-web"

    | "chats.title"
    | "chat.labels.you"
    | "chat.labels.message"
    | "chat.labels.delete-conversations"
    | "chat.labels.fowarded"
    | "chat.action.markread"
    | "chat.empty"
    | "chat.unread"
    | "chat.unknown"

    | "message.chats.alertdelete"

    | "feed.empty"
    | "feed.comments.empty"
    | "feed.videos.comments"
    | "feed.videos.comment"
    | "feed.videos.addtag"
    | "feed.videos.share"
    | "feed.videos.shared-for"
    | "feed.videos.notfound"

    | "screen.title.addwallet"
    | "screen.title.importwallet"
    | "screen.title.addfriend"
    | "screen.title.donate"
    | "screen.title.newchat"

    | "order.new.title"
    | "order.new.amount-title"



    | "en"
    | "pt"



