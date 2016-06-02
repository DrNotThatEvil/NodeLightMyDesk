const dashboardActions = {
    setStatus: function setStatus(value)
    {
        return {
            type: 'SET_STATUS',
            value: value
        };
    },
    fetchStatus: function fetchStatus(cb)
    {
        return function (dispatch) {
            return fetch('/dashboard/getstatus')
            .then(response => response.json())
            .then(json => {
                dispatch(dashboardActions.setStatus(json.data[0].value));
                if(cb)
                    cb(json.data[0].value);
            });
        };
    },
    setColor: function setColor(color)
    {
        return {
            type: 'SET_COLOR',
            value: color
        };
    },
    fetchColor: function fetchColor(cb)
    {
        return function (dispatch) {
            return fetch('/dashboard/getcolor')
            .then(response => response.json())
            .then(json => {
                dispatch(dashboardActions.setColor(json.data[0].value));
                if(cb)
                    cb(json.data[0].value);
            });
        };
    }
};

module.exports = dashboardActions;
