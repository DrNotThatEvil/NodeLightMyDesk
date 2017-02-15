module.exports = (RGBControl) => {
  RGBControl.registerProcessor('steadycolor', (c, arg) => {
    let curColor = c.filterPixel(arg.color, 1);
    c.setColor(curColor); //setting the color must be done before translation

    if(arg.translate)
      curColor = c.translateColor(curColor);

    let leds = [];
    for(let i=0; i<c.getNumLeds(); i++)
    {
      leds.push(curColor[0], curColor[1], curColor[2]);
    }

    c.writeStream(leds);

    c.nextJob();
    //done(null, true);
  });
};
