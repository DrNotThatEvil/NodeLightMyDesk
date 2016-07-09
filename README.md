Node Light My Desk
======================

I made this cause my old i wanted to rewrite my old lightmydesk system witch used python.
this system now uses NodeJS its a complete re-write and it is more stable than the previous version.

There are still some bugs one of them being that the raspberry pi can run out of memory
i currently have a program called supervisor on my raspberry pi that restarts the system in case this happens to make it usable while i figure 
out why this happens.

but for the most part its more stable than the previous version...
(although saying that is not mutch of a achivement since the old version was as stable as a horse with 2 legs on stilts runing along a treadmil that is glued to the roof of my room but i digres)

im stil quite happy with re result.

## Plugins
Currently there are a few plugins included with the system.
* Email plugin: Lights up the ledstrip with a blue flash when a email is send to you also able to flash red when a specific 'important' email arives witch can be configured
* Twitch plugin + Twitch alerts: Plugin that allows the ledstrip to controlled using twitch chat and by donating to a twitch alerts account
* Beam.Pro + Stream jar: Same kind of thing as the Twitch plugin but using the Beam.pro interactive stream system and using stream jar ( I personally like this plugin better cause i come to love beam.pro and its api also streamjar is really easy so...)
* More comming soon

## Future plugins and plans
I would like to make more plugins some future ideas are:
* Bitcoin notify: a plugin that flashes the ledstrip when your crypto currency's value passes a threshold (reaches the moon) (or when you recieve money possibly..)
* Twitter notify: a plugin that flashes the ledstrip when you recieve a tweet with configurable criteria (only @ tweets for example or all tweets)

Also i would like to add things to the core system like:
* Ipad and Iphone compatibility: For some reason iphones and ipads do not show to interface but a blank page witch needs to be fixed cause its anying me
* A state restore system for when a crash ocours
* More animations.
* System settings: currently i include a settings menu item but i have not yet populated the page.
* More ledstrip chip types: only the LPD6803 is currently supported.

# Please note
This code is still in **heavy development** i still need to fix a lot of bugs. I also need to do a bit of code clean up since have included eslint at a later date i still need to rework to code to pass the eslint tests but i plan to do so when the code becomes more stable and a few bugs are fixed.

**Warning the package.json needs to be cleaned it will install a lot of stuff i used in development but did not use.**

# !!! This code is under heavy developent !!!
As stated this code is still under heavy development but i wanted to put it out there for my friends to see what i have been up to! So have fun!
