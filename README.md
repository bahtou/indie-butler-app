# The Indie Butler

Too many of the web sites we once loved and used eventually shutdown and lose our data with it.
Too many of the web sites we use force us to chose between them and our friends.

The butler aims at providing an elegant way to both these issues, by hosting your data
locally, inside your browser (like the [msgboy](http://www.msgboy.com/) does). It simply
'hijacks' whatever action you perform on certain websites (help us add more!) and saves them
locally.

Also, using a [relay](https://github.com/julien51/indie-butler-relay), it can serve them
to your friends using open data formats and protocols such as [Atom](http://en.wikipedia.org/wiki/Atom_(standard)), [
Activity Streams](http://activitystrea.ms/) and [PubSubHubbub](https://code.google.com/p/pubsubhubbub/).
This whole part is obviously optional and you will need to own your own domain to do so (we don't
want you do depend on a specific app/service for this).

## Install it.

_This version is still an extremely early version. You may find bugs, issues: please report them._

* `$ git clone git://github.com/julien51/indie-butler-app.git`
* In Chrome (works with Canary too), go to: [`chrome://chrome/extensions/`](chrome://chrome/extensions/)
* Click on `Developer Mode`
* Click on `Load unpacked extension`
* Point it to the `indie-butler-app` (from 1st step).
* You are done. Now, when you to to Twitter or Facebook and shared stories, they're stored locally. You
can check that by clicking on the 'indie-butler' app on your Chrome 'Home' screen.

If you want to serve the content of your butler to your friends:
* Create a CNAME record for the butler subdomain of your domain name. Make it point to an existing relay, like [http://butler.jit.su/](http://butler.jit.su/). Feel free to host your own relay as well (for free!) by following [these instructions](https://github.com/julien51/indie-butler-relay). _My domain is ouvre-boite.com, and I just pointed butler.ouvre-boite.com to http://butler.jit.su/_
* ... wait for a couple hours for DNS propagation...
* In the meantime, make sure you have a `rel=me` link at the root of your domain name that points to a service supported by [IndieAuth](https://indieauth.com/), like Twitter or Github. _If you go to [`http://ouvre-boite.com/`](http://ouvre-boite.com/) you will see that I have a link like this: `<a href="http://twitter.com/julien51" rel="me">Twitter</a>`. This tells people on my site that I own that Twitter account. Now go to [http://twitter.com/julien51](http://twitter.com/julien51) and you will see that there is a link like `<a target="_blank" rel="me nofollow" href="http://ouvre-boite.com">http://ouvre-boite.com</a>` which tells people I own this site too. Which means that, once it's 'proven' that I own that Twitter handle (thru their authentication), it's proven that I own the `ouvre-boite.com` domain.
* ... Once DNS has been propagated ...
* Go to [``chrome://chrome/extensions/](chrome://chrome/extensions/)
* Go to your local app's settings
* Enter your domain name.
* Restart Chrome.
* The binding process currently takes a couple minutes (as there are a lot of round trips between the relay, your authentication provider, and the app.... but that should work after a couple minutes.
* Go to (and tell your friends!): `http://butler.<your domain>/stream`.


## TODO:
* Publishing from the butler itself.
* Better debugging information... Is the user binded?
* File Editing from the app itself... that's a bit tricky, but that would be amazing.
* More interceptors, improve existing for better AS support.
* Historical imports. This will be useful for the services you use outside
the browser (mobile apps mostly)
* Port to Firefox


