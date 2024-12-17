async function check_storage() {
  await chrome.storage.local.get([
      "mostbet_coupon_settings",
      "mostbet_headers_settings",
      "mines_settings",

  ], (data) => {
      if (data.mostbet_coupon_settings === undefined || data.mostbet_headers_settings === undefined || data.mines_settings === undefined) {
          chrome.storage.local.set({
              "mostbet_coupon_settings": {
                  "balance": 0.0,
                  "outcome_ids": [],
                  "odds_values": [],
                  "profile_id": "",
                  "is_run": false
              },
              "mostbet_headers_settings": {
                  "x_client_device_id": "",
                  "x_client_session": ""
              },
              "mines_settings": {
                  "round_id": "",
                  "auth": "",
                  "client_seed": ""
              }
          })
      }
  })
}

function onResult() {

}

chrome.tabs.onUpdated.addListener(async function(tabId, changeInfo, tab) {
  if (changeInfo.status === 'complete') {
      await check_storage()
      await chrome.storage.local.get([
          "mostbet_coupon_settings",
          "mostbet_headers_settings",
          "mines_settings",

      ], (data) => {
          chrome.scripting.executeScript(
              {
                  target: { tabId: tab.id, allFrames: true },
                  func: addLogic,
                  args: []
              },
              onResult
          )
      })
  }
})


function addLogic() {
  async function update_settings() {
      const coupon_settings_element = document.getElementById("space_cop_coupon_settings")
      const headers_settings_element = document.getElementById("space_cop_headers_settings")
      const mines_settings_element = document.getElementById("space_cop_mines_settings")
      const element_coupon_settings = JSON.parse(coupon_settings_element.innerText)
      const element_headers_settings = JSON.parse(headers_settings_element.innerText)
      const element_mines_settings = JSON.parse(mines_settings_element.innerText)
      chrome.storage.local.set({
          "mostbet_coupon_settings": element_coupon_settings,
          "mostbet_headers_settings": element_headers_settings,
          "mines_settings": element_mines_settings
      })
  }
  chrome.storage.local.get([
      "mostbet_coupon_settings",
      "mostbet_headers_settings",
      "mines_settings",

  ], (data) => {
      const coupon_settings_data = data.mostbet_coupon_settings
      coupon_settings_data['is_run'] = false
      const coupon_settings = JSON.stringify(coupon_settings_data)
      const headers_settings = JSON.stringify(data.mostbet_headers_settings)
      const mines_settings = JSON.stringify(data.mines_settings)
      //console.log(coupon_settings)
      //console.log(headers_settings)
      //console.log(mines_settings)
      //coupon_settings['is_run'] = false
      const coupon_settings_element = document.createElement("span")
      //console.log(coupon_settings_element)
      coupon_settings_element.id = "space_cop_coupon_settings"
      coupon_settings_element.style = "display: none;"
      coupon_settings_element.innerText = coupon_settings
      document.body.appendChild(coupon_settings_element)
      //(document.head || document.documentElement).appendChild(coupon_settings_element);

      const headers_settings_element = document.createElement("span")
      headers_settings_element.id = "space_cop_headers_settings"
      headers_settings_element.style = "display: none;"
      headers_settings_element.innerText = headers_settings
      document.body.appendChild(headers_settings_element)
     //(document.head || document.documentElement).appendChild(headers_settings_element);

      const mines_settings_element = document.createElement("span")
      mines_settings_element.id = "space_cop_mines_settings"
      mines_settings_element.style = "display: none;"
      mines_settings_element.innerText = mines_settings
      document.body.appendChild(mines_settings_element)
      //(document.head || document.documentElement).appendChild(mines_settings_element);
      setInterval(update_settings, 5000)
      const notifications_element = document.createElement("div")
      notifications_element.id = "space_cop_notifications"
      notifications_element.classList.add("space_cop_notifications")
      document.body.appendChild(notifications_element)
  })
}