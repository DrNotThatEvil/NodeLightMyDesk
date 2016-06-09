const serverActions = {
    putErrors: function putError(errors)
    {
        return {
            type: 'PUT_ERRORS',
            errors: errors
        };
    },
    setInstalled: function setInstalled(value)
    {
        return {
            type: 'SET_INSTALLED',
            value: value
        };
    },
    setLedLengthLock: function setLedLengthLock(value)
    {
        return {
            type: 'SET_LEDLENGTHLOCK',
            value: value
        };
    },
    setSpiDevType: function setChipType(value)
    {
        return {
            type: 'SET_SPIDEVTYPE',
            value: value
        };
    },
    setSpiDevAsync: function setSpiDevAsync(value)
    {
        return function (dispatch) {
            return fetch('/install/setdevicename',{
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    devicename: value
                })
            })
            .then(response => response.json())
            .then(json => {
                if(json.errors.length == 0)
                {
                    dispatch(serverActions.setSpiDevType(json.data[0].value));
                }
                else
                {
                    dispatch(serverActions.putErrors(json.errors));
                }
            });
        };
    },
    setNumLeds: function setNumLeds(value) {
        return {
            type: 'SET_LEDLENGTH',
            value: value
        };
    },
    setNumLedsAsync: function setNumLedsAsync(value)
    {
        return function (dispatch) {
            return fetch('/install/setnumleds',{
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    numleds: value
                })
            })
            .then(response => response.json())
            .then(json => {
                if(json.errors.length == 0)
                {
                    dispatch(serverActions.setNumLeds(json.data[0].value));
                }
                else
                {
                    dispatch(serverActions.putErrors(json.errors));
                }
            });
        };
    },
    setChipType: function setChipType(value)
    {
        return {
            type: 'SET_CHIPTYPE',
            value: value
        };
    },
    setChipTypeAsync: function setChipTypeAsync(value)
    {
        return function (dispatch) {
            return fetch('/install/setchiptype',{
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    chiptype: value
                })
            })
            .then(response => response.json())
            .then(json => {
                if(json.errors.length == 0)
                {
                    dispatch(serverActions.setChipType(json.data[0].value));
                }
                else
                {
                    dispatch(serverActions.putErrors(json.errors));
                }
            });
        };
    },
    setColorMap: function setColorMap(map)
    {
        return {
            type: 'SET_COLORMAP',
            value: map
        };
    },
    setColorMapAsync: function setChipTypeAsync(colormap, cb)
    {
        return function (dispatch) {
            return fetch('/install/setcolormap',{
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    colormap: colormap
                })
            })
            .then(response => response.json())
            .then(json => {
                if(json.errors.length == 0)
                {
                    dispatch(serverActions.setColorMap(json.data[0].value));
                    if(typeof(cb) == 'function')
                        cb();
                }
                else
                {
                    dispatch(serverActions.putErrors(json.errors));
                }
            });
        };
    },
    fetchInstalled: function fetchInstalled(cb)
    {
        return function (dispatch) {
            return fetch('/install/checkinstall')
            .then(response => response.json())
            .then(json => {
                dispatch(serverActions.setInstalled(json.installed));
                if(cb)
                    cb(json.installed);
            });
        };
    },
    clearJobs: function clearJobs(cb)
    {
        return function () {
            return fetch('/install/clearjobs')
            .then(response => response.json())
            .then(json => {
                if(cb)
                    cb(json.data[0].set);
            });
        };
    },
    startPulse: function startPulse(color)
    {
        return function (dispatch) {
            return fetch('/install/pulse',{
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    color: color
                })
            });
        };
    },
    setSaved: function setSaved(status)
    {
        return {
            type: 'SET_SAVED',
            value: status
        };
    },
    saveConfig: function saveConfig(cb)
    {
        return function (dispatch) {
            return fetch('/install/save')
            .then(response => response.json())
            .then(json => {
                if(json.errors.length == 0)
                {
                    dispatch(serverActions.setSaved(json.data[0].status));
                    if(typeof(cb) == 'function')
                        cb();
                }
                else
                {
                    dispatch(serverActions.putErrors(json.errors));
                }
            });
        };
    }
};

module.exports = serverActions;
