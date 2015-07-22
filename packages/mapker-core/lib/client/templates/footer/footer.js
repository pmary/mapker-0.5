Template.footer.rendered = function() {
	this.autorun(function () {
		if (Meteor.user()) {
			window.$zopim||(function(d,s){var z=$zopim=function(c){z._.push(c)},$=z.s=
			d.createElement(s),e=d.getElementsByTagName(s)[0];z.set=function(o){z.set.
			_.push(o)};z._=[];z.set._=[];$.async=!0;$.setAttribute("charset","utf-8");
			$.src="//v2.zopim.com/?2zZTfHVDPudF9i6og1uvIJ8HQojuXEMp";z.t=+new Date;$.
			type="text/javascript";e.parentNode.insertBefore($,e)})(document,"script");

			if ($zopim) {
				$zopim(function() {
					$zopim.livechat.setName(Meteor.user().profile.fullname);
					$zopim.livechat.setEmail(Meteor.user().emails[0].address);
					if (Meteor.user().profile.avatar && Meteor.user().profile.avatar.url) {
						$zopim.livechat.badge.setImage(Meteor.user().profile.avatar.url);
					}
				});
			}
		}
	});
};
