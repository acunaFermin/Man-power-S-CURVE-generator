class curvaHH {
    constructor(HH,n,Ym,Yc,S0,S1,c){
        this.HH = HH;
        this.a = 0;
        this.b = HH;
        this.n = n;
        this.Ym = Ym;
        this.Yc = Yc;
        this.S0 = S0;
        this.S1 = S1;
        this.c  = c;

        /************************/
        this.suma = 0;
        this.resultado = [0];
        this.x = [0];
        this.z = [0];
        this.gauss = [0];
        this.gaussAcum = [0];

    }

    acum (j){

        let k = this.Ym - 2*(this.Ym - this.Yc)/(Math.exp(this.S0*(j-this.c))+Math.exp(this.S1*(j-this.c)));
        return k;
    }

    funcion (x){
        let k = this.acum(x) - this.acum(x-1);
        return k;
    }
    
    cargar(){
        let x = [];
        let i = 0;
        for(i; i<this.n; i++){
            let A = this.funcion(i*(30/this.n));
            x[i]= A;
        }
        i = 0;
        return x;
    }

    reparte(hh){
        let res = 0;
        let suma = 0;
        let i = 0;
        let x = [];
        x = this.cargar(); 
        let max = Math.max(...x);
        x.forEach(element => {
            element = element/max * hh;
            element = Math.ceil(element);
            x[i] = element;
            suma = suma + element;
            i++;
        });
        
        res = suma - this.HH;
        i = 0;
        this.suma = suma;
        this.x = x;
        return res;
    }

    validacion() {
        let I = 0;

        I = I + 1;
        let m = (this.a + this.b) / 2;
        let fm = this.reparte(m);
    
        if (fm == 0) {
            let i = 0;
            let acumulado = 0;
    
            this.x.forEach(element => {
                acumulado = acumulado + element;
                this.z[i] = acumulado;
                i++;
            });
            this.gauss = this.x;
            this.gaussAcum = this.z;
        }
            else {
            /*validar que sean de signos opuestos*/
            let r = this.reparte(m) * this.reparte(this.a);
            if (r < 0) {
                this.b = m;
                this.biseccion();
            }
            else {
                this.a = m;
                this.biseccion();
            }
        }
}
    biseccion() {
        if (this.reparte(this.a) * this.reparte(this.b) < 0) {
            this.validacion();
        }
        else {
            alert('Ha ingresado un dato erroneo')
        }
    }
}

let HH = 10000;
let n = 20;     /*cantidad de intervalos */
let Ym = 100;
let Yc = 50;
let S0 = 0.4;   /*0.4* achata la curva: 0 es una recta, 0,4 es una campana puntiaguda*/
let S1 = 0.01;  /*0.01* aumenta las HH al comienzo, 0.01 normal, mas de 0.01 y se  levanta la pata izquierda de la campana  */
let c = 10;     /*10 izq, 15 centro, 20 derecha*/

let ejeX = [];

for(let i = 0; i<n; i++){
    ejeX[i] = i;
}


let prueba = new curvaHH(HH,n,Ym,Yc,S0,S1,c);

prueba.biseccion();

let ejeYgauss = prueba.gauss;
let ejeYacum = prueba.gaussAcum;    

/*********GRAFICAS**************/

let grafGauss =  Highcharts.chart('gauss', {

    title: {
        text: 'Distribución de Horas Hombre en forma de Gauss'
    },

    subtitle: {
        text: ''
    },

    yAxis: {
        title: {
            text: 'Horas Hombre'
        }
    },

    xAxis: {
        categories: ejeX
    },

    legend: {
        layout: 'vertical',
        align: 'right',
        verticalAlign: 'middle'
    },

    plotOptions: {
        series: {
            label: {
                connectorAllowed: false
            },
            pointStart: 0
        }
    },

    series: [{
        name: '',
        data: ejeYgauss
    }],

    responsive: {
        rules: [{
            condition: {
                maxWidth: 500
            },
            chartOptions: {
                legend: {
                    layout: 'horizontal',
                    align: 'center',
                    verticalAlign: 'bottom'
                }
            }
        }]
    }

});


let grafGaussAcum = Highcharts.chart('gaussAcum', {

title: {
    text: 'Acumulado de Horas Hombre'
},

subtitle: {
    text: ''
},

yAxis: {
    title: {
        text: 'Horas Hombre'
    }
},

xAxis: {
    categories: ejeX
},

legend: {
    layout: 'vertical',
    align: 'right',
    verticalAlign: 'middle'
},

plotOptions: {
    series: {
        label: {
            connectorAllowed: false
        },
        pointStart: 0
    }
},

series: [{
    name: '',
    data: ejeYacum
}],

responsive: {
    rules: [{
        condition: {
            maxWidth: 500
        },
        chartOptions: {
            legend: {
                layout: 'horizontal',
                align: 'center',
                verticalAlign: 'bottom'
            }
        }
    }]
}

});


/********************* nuevos calculos **********************/ 

let calcular = document.querySelector(".boton");

function change(){
    c = parseFloat(document.getElementById("c").value);
    HH = parseFloat(document.getElementById("HH").value);
    n = parseFloat(document.getElementById("n").value);
    S0 = parseFloat(document.getElementById("S0").value);

    let prueba1 = new curvaHH(HH,n,Ym,Yc,S0*0.02,S1,c*0.25);

    prueba1.biseccion();

    for(let i = 0; i<prueba1.n; i++){
        ejeX[i] = i;
    }

    ejeYgauss = prueba1.gauss;
    ejeYacum = prueba1.gaussAcum;
    grafGauss.xAxis[0].setCategories(ejeX);
    grafGauss.series[0].setData(ejeYgauss);
    grafGaussAcum.xAxis[0].setCategories(ejeX);
    grafGaussAcum.series[0].setData(ejeYacum);

}




    