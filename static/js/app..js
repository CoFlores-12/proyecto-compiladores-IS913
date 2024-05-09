const toggleSidebarMobileSearch = document.getElementById('toggleSidebarMobileSearch');
const loadingModal = document.getElementById('loadingModal');
const updateLogo = document.getElementById('updateLogo');
//selects
const origenCurrency = document.getElementById('origenCurrency');
const desCurrency = document.getElementById('desCurrency');

//labels
const orcurr = document.getElementById('orcurr');
const convertDes = document.getElementById('convertDes');

//numbers
const convertOrigValue = document.getElementById('origenNumber');
const desNumber = document.getElementById('desNumber');

var symbols = [];
var historyCurr = [];
var options = {method: 'GET'};
var dataChart = [];
var datesChart = [];
var chart = null;

toggleSidebarMobileSearch.addEventListener('click', function(e) {
  loadingModal.classList.remove('hidden');

  fetch('/api/update', {
    method: 'GET'
  })
  .then(response => response.json())
  .then(response => {
    if (response.response === 'updated'){
      init();
    }
  })
})

convertOrigValue.addEventListener('keyup', ()=>{
  value = convertOrigValue.value;
  orig = origenCurrency.value;
  dest = desCurrency.value;
  if (value === '') {
    return
  }
  fetch('/api/convert', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      value: value,
      orig: orig,
      dest: dest
    })
  })
  .then(response => response.json())
  .then(response => {
    desNumber.value = response.response
  });
})
desNumber.addEventListener('keyup', ()=>{
  value = desNumber.value;
  orig = desCurrency.value;
  dest = origenCurrency.value;

  if (value === '') {
    return
  }
  fetch('/api/convert', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      value: value,
      orig: orig,
      dest: dest
    })
  })
  .then(response => response.json())
  .then(response => {
    convertOrigValue.value = response.response
  });
  
})
origenCurrency.addEventListener("change", ()=>{
  orig = origenCurrency.value;
  dest = desCurrency.value;
  value = convertOrigValue.value;

  if (value === '') {
    return
  }
  fetch('/api/convert', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      value: value,
      orig: orig,
      dest: dest
    })
  })
  .then(response => response.json())
  .then(response => {
    desNumber.value = response.response
  });
  orcurr.innerHTML = symbols[orig];
  convertDes.innerHTML = historyCurr[historyCurr.length-1]['rates'][dest]/historyCurr[historyCurr.length-1]['rates'][orig] + " " + symbols[dest];
  
  updateChart()
});
desCurrency.addEventListener("change", ()=>{
  orig = origenCurrency.value;
  dest = desCurrency.value;
  value = convertOrigValue.value;

  if (value === '') {
    return
  }
  fetch('/api/convert', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      value: value,
      orig: orig,
      dest: dest
    })
  })
  .then(response => response.json())
  .then(response => {
    desNumber.value = response.response
  });
  orcurr.innerHTML = symbols[orig];
  convertDes.innerHTML = historyCurr[historyCurr.length-1]['rates'][dest]/historyCurr[historyCurr.length-1]['rates'][orig] + " " + symbols[dest];
  
  updateChart()
});

function updateChart() {
  orig = origenCurrency.value;
  dest = desCurrency.value;
  dataChart = [];
  for (const data of historyCurr) {
    dataChart.push(data['rates'][dest]/data['rates'][orig])
  }
  if (document.getElementById('myChart')) {
  
    const data = {
      labels: datesChart,
      datasets: [{
        data: dataChart,
        borderWidth: 1,
        tension: 0.4,
        backgroundColor: "#091c5a4d",
        borderColor: "#091c5a",
        fill: true,
      }]
    }
    chart.data = data;
    chart.update();
  };
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async  function init(){
  symbols = [];
  historyCurr = [];
  options = {method: 'GET'};
  dataChart = [];
  datesChart = [];

fetch('/api/symbols', options)
  .then(response => response.json())
  .then(response => {
    symbols = response
    for (var key in response){
      if(key == "USD"){
        
      }else {
      origenCurrency.innerHTML += `<option value="${key}">${key}</option>`
      desCurrency.innerHTML += `<option value="${key}">${key}</option>`
      }
    }
    origenCurrency.value = 'EUR'
    orcurr.innerHTML = symbols[origenCurrency.value];
  })
  .catch(err => console.error(err));

  fetch('/api/lastest', options)
  .then(response => response.json())
  .then(response => {
    
    const HNLbase = document.getElementById('HNLbase');
    const USDbase = document.getElementById('USDbase');
    const CNYbase = document.getElementById('CNYbase');

    HNLbase.innerHTML = response['rates']['HNL'];
    USDbase.innerHTML = response['rates']['USD'];
    CNYbase.innerHTML = response['rates']['CNY'];

    convertDes.innerHTML = response['rates']['USD']+ " " + symbols['USD'];
    desNumber.value =  response['rates']['USD']
  })
  .catch(err => console.error(err));

  await fetch('/api/history', options)
  .then(response => response.json())
  .then(response => {
    historyCurr = response;
    for(const data of response) {
      dataChart.push(data['rates']['USD']);
      datesChart.push(data['date']);
    };
  })
  .catch(err => console.error(err));
  document.getElementById('containerCanva').innerHTML = '<canvas id="myChart"></canvas>'
  if (document.getElementById('myChart')) {
    const ctx = document.getElementById('myChart');

    chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: datesChart,
        datasets: [{
          data: dataChart,
          borderWidth: 1,
          tension: 0.4,
          backgroundColor: "#091c5a4d",
          borderColor: "#091c5a",
          fill: true,
        }]
      },options: {
        plugins: {
          legend: {
            display: false,
            text: 'Chart Title',
          }
        }
      }
    });
  };

  sleep(1000)

  loadingModal.classList.add('hidden');

}

init();
