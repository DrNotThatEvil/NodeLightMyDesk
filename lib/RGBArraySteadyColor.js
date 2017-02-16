module.exports = (RGBControl) => {
  RGBControl.registerProcessor('arraysteadycolor', (c, arg) => {
    c.setColor([0,0,0]); //setting the color to black since it's there is no single color now.

    let leds = [];
    for(let i=0; i<c.getNumLeds(); i++)
    {
      let loopLed = arg.leds[i];

      if(loopLed.length > 3) 
        loopLed = [0, 0, 0];

      let safe = true;
      for(let j=0; j<loopLed.length; j++) {
        if(loopLed[j] < 0 || loopLed[j] > 255) {
          safe = false; 
        }
      }

      if(!safe) {
        loopLed = [0, 0, 0];
      }

      let curColor = c.filterPixel(loopLed, 1);

      if(arg.translate)
        curColor = c.translateColor(loopLed);

      leds.push(curColor[0], curColor[1], curColor[2]);
    }

    c.writeStream(leds);

    c.nextJob();
    //done(null, true);
  });
};
