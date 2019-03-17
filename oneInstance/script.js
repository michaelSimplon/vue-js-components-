window.onload=function()
{
    //Composant recherche et tableau
    Vue.component('tableau', {
      template: `
      <div>
          <form id="search">
            Search <input name="query" v-model="filterKey" placeholder="keyword">
          </form>
          <table id="maintable">
            <thead>
              <tr>
                <th v-for="key in columns"
                  @click="sortBy(key)"
                  :class="{ active: sortKey == key }">
                  {{ key | capitalize }}
                  <span class="arrow" :class="sortOrders[key] > 0 ? 'asc' : 'dsc'">
                  </span>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(entry, index) in filteredData" class="item" v-bind:id="index" @click="sendfiche(entry)" >
                <td v-for="key in columns">
                  {{entry[key]}}
                </td>
              </tr>
            </tbody>
          </table>
      </div>
      `,
      props: {
        data: Array,
        columns: Array
      },
      data: function () {
        var sortOrders = {}
        this.columns.forEach(function (key) {
          sortOrders[key] = 1
        })
        return {
          sortKey: '',
          sortOrders: sortOrders,
          filterKey: ''
        }
      },
      computed: {
        filteredData: function () {
          var sortKey = this.sortKey
          var order = this.sortOrders[sortKey] || 1
          var data = this.data
          if (this.filterKey) {
              data = data.filter(adherent => {
                  return adherent.name.toLowerCase().includes(this.filterKey.toLowerCase())
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
        },
        sendfiche:function (adherent) {
            this.$emit('sendfiche', adherent)
        }
      }
    })
    //Composant fiche personnelle
    Vue.component('fiche-perso',{
        template: `
          <div id="details">
            <h3>Fiche personnelle</h3>
            <p>Nom : {{ item.name }}</p>
            <p>Sexe : {{ item.gender }}</p>
            <p>Email : {{ item.email }}</p>
            <p>Age : {{ item.age }}</p>
            <p>Téléphone : {{ item.phone }}</p>
            <p>Société : {{ item.company }}</p>
            <p>Adresse : {{ item.address }}</p>
          </div>
        `,
        props:['item']
    })
    //Composant Statistiques
    Vue.component('stats',{
        template: `
        <div id="stats">
          <h3>Statistiques</h3>
          <p>Nombre total d'adhérents : <span id="stat1">{{this.data.length}}</span></p>
          <p>Nombre d'hommes : <span id="stat2">{{this.hommes}}</span></p>
          <p>Nombre de femmes : <span id="stat3">{{this.femmes}}</span></p>
          <p>Age moyen : <span id="stat4">{{ageMoyen}}</span></p>
        </div>
        `,
        props:['data'],
        computed:{
            hommes: function () {
                return this.data.reduce((acc, cur) => cur.gender === 'male' ? ++acc : acc, 0)
            },
            femmes: function () {
                return this.data.reduce((acc, cur) => cur.gender === 'female' ? ++acc : acc, 0)
            },
            ageMoyen: function () {
                var sommeAges = this.data.reduce((acc, cur) => cur.age + acc,0);
                return Math.round(sommeAges / this.data.length)+" ans"
            }
        }
    })
    //Instance de Vue
    var appVue = new Vue({
        el: '#app',
        data: {
            gridColumns: ['name', 'email'],
            gridData: database,
            item:database[0]
        },
        methods:{
            updateItem: function(adherent) {
                this.item = adherent;
            }
        }
    });
}
