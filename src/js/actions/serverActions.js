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
    fetchInstalled: function fetchInstalled()
    {
        return function (dispatch) {
            return fetch('/install/checkinstall')
            .then(response => response.json())
            .then(json => dispatch(serverActions.setInstalled(json.installed)));
        };
    },
    startPulse: function startPulse()
    {
        return function (dispatch) {
            return fetch('/install/checkinstall')
            .then(response => response.json())
            .then(json => dispatch(serverActions.setInstalled(json.installed)));
        };
    }
};

module.exports = serverActions;
