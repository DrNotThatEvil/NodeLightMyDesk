class RGBControl
{
    constructor(config)
    {
        this.state = {
            chipType: '',
            deviceName: '',
            numLeds: 1
        };
    }

    setChipType(chipType)
    {
        this.state.chipType = chipType;
    }

    getChipType(chipType)
    {
        return this.state.chipType;
    }

    setDeviceName(deviceName)
    {
        this.state.deviceName = deviceName;
    }

    getDeviceName(deviceName)
    {
        return this.state.deviceName;
    }
}

module.exports = (new RGBControl());
