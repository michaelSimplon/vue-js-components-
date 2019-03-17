var item = database[0] ;
window.onload=function()
{



  // utilisation de vue.js à travers la création d'un composant complexe (voir script dans html)
  Vue.component('demo-grid', {
    template: '#grid-template',
    props: {
      data: Array,
      columns: Array,
      filterKey: String
    },
    data: function () {
      var sortOrders = {}
      this.columns.forEach(function (key) {
        sortOrders[key] = 1
      })
      return {
        sortKey: '',
        sortOrders: sortOrders
      }
    },
    computed: {
      filteredData: function () {
        var sortKey = this.sortKey
        var filterKey = this.filterKey && this.filterKey.toLowerCase()
        var order = this.sortOrders[sortKey] || 1
        var data = this.data
        if (filterKey) {
          data = data.filter(function (row) {
            return Object.keys(row).some(function (key) {
              return String(row[key]).toLowerCase().indexOf(filterKey) > -1
            })
          })
        }
        if (sortKey) {
          data = data.slice().sort(function (a, b) {
            a = a[sortKey]
            b = b[sortKey]
            return (a === b ? 0 : a > b ? 1 : -1) * order
          })
        }
        return data
      }
    },
    filters: {
      capitalize: function (str) {
        return str.charAt(0).toUpperCase() + str.slice(1)
      }
    },
    methods: {
      sortBy: function (key) {
        this.sortKey = key
        this.sortOrders[key] = this.sortOrders[key] * -1
      }
    }
  })

  // initialisation du composant demo
  var demo = new Vue({
    el: '#demo',
    data: {
      searchQuery: '',
      gridColumns: ['name', 'email'],
      gridData: database
    }
  }) ;


  // initialisation du composant de fiche perso
  var app = new Vue({
      el: '#details'
  }) ;
  // quand on clique sur un element on maj la fiche personnelle
  $( ".item" ).on( "click", function() {
    item = database[$(this).attr("id")] ;
    app.$forceUpdate();
  });


  // calcul des statistiques
  var stat1 = 0 ;
  var stat2 = 0 ;
  var stat3 = 0 ;
  var stat4 = 0 ;
  for (i=0 ; i < database.length ; i++)
  {
    stat1 ++;
    if (database[i].gender == "male") stat2 ++ ;
    if (database[i].gender == "female") stat3 ++ ;
    stat4 = stat4 + database[i].age ;
  }

  // affichage des statistiques
  document.getElementById("stat1").innerHTML = stat1 ;
  document.getElementById("stat2").innerHTML = stat2 ;
  document.getElementById("stat3").innerHTML = stat3 ;
  document.getElementById("stat4").innerHTML = Math.round(stat4 / stat1)+" ans" ;

}

