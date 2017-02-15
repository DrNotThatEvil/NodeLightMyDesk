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
  syncSetStatus: function syncSetColor(status, cb)
  {
    return function (dispatch) {
      return fetch('/dashboard/setstatus',{
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          status: status
        })
      })
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
  },
  syncSetColor: function syncSetColor(color, cb)
  {
    return function (dispatch) {
      return fetch('/dashboard/setcolor',{
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          color: color
        })
      })
      .then(response => response.json())
      .then(json => {
        dispatch(dashboardActions.setColor(json.data[0].value));
        if(cb)
          cb(json.data[0].value);
      });
    };
  },
  fetchSidebarPlugins: function fetchSidebarPlugins(cb)
  {
    return function () {
      return fetch('/plugin/sidebar')
      .then(response => response.json())
      .then(json => {
        //dispatch(dashboardActions.setColor(json.data[0].value));
        if(cb)
          cb(json.data);
      });
    };
  },
  setModuleStatus: function setModuleStatus(modid, value, cb)
  {
    return function () {
      return fetch('/plugin/setpluginstatus',{
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          id: modid,
          value: value
        })
      })
      .then(response => response.json())
      .then(json => {
        //console.log(json);

        if(cb)
          cb(json.data[0].value);
      });
    };
  }
};

module.exports = dashboardActions;
