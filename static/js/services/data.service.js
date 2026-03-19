angular.module('Writter')
.service('DataService', ['$rootScope','$http', '$q', 'CacheService', function($rootScope, $http, $q, CacheService) {	
	let main = {};

	this.getData = function(){
		return main;
	}

	this.setData = function(key, newData){
		main[key] = newData;
		$rootScope.$broadcast('dataUpdated', main);
	}

	//+ Sweet Advice ========
	const Toast = Swal.mixin({
		toast: true,
		position: "bottom-end",
		showConfirmButton: false,
		timer: 4500,
		timerProgressBar: true,
		didOpen: (toast) => {
		toast.onmouseenter = Swal.stopTimer;
		toast.onmouseleave = Swal.resumeTimer;
		}
	});

	const error_swal_config = {
		icon: "error",
		title: "😨¡Ha sucedido un error!😨 \n<b>Smart Manufacturing</b> ya esta trabajando para solucionarlo.",
	};

	const issues_swal_config = {
		icon: "warning",
		title: "¡Has pasado algo por alto!\n⚠️",
		timer: 50000,
		footer: 'Todo esta bien, solo ha sido un pequeño inconveniente.',
	};

	const accepted_swal_config = {
		icon: "success",
		title: "¡Hecho con exito!\n✅",
		timer: 50000,
		footer: 'Todo ok',
	};

	const loading_swal_config = {
		title: "Procesando...",
		html: "Por favor espera mientras se completa la operación.",
		allowOutsideClick: false, 
		allowEscapeKey: false, 
		timerProgressBar: true,
		didOpen: () => {
		Swal.showLoading();
		},
	};

	//+ Manage ========
	this._request = async function(url, cache_name, {refuse_cache}) {
		const cache = CacheService.getData(cache_name, {refuse_cache:refuse_cache});
		if (cache) return cache

		const response = await $http.get(url, { timeout: 60000 });
		if (response.status == 200) {
			console.log("Datos obtenidos con éxito!");
			if (cache_name){
				//+ Guardar cache
				CacheService.setData({cache_name:cache_name, data:response.data});
			}
			return response.data;
		}

	}
	
	this.fetchServerData = async function(url, {cache_name, handler_error=true, refuse_cache=false}={}) {
		let advice = true;
		return new Promise((resolve, reject) => {
			const attemptRequest = async () => {
				try {
					const data = await this._request(url, cache_name, {refuse_cache:refuse_cache});
					if (data) {
						this.setData(cache_name, data);
						resolve(data);  
					} else {
						console.log("Datos no válidos, reintentando en 10 segundos...");
						setTimeout(attemptRequest, (1 * 60 * 1000)); //+ Cada minuto checa
					}
				} catch (error) {
					if (!handler_error){ return reject('handler error disabled');}
					console.log("Error en la solicitud: ");
					console.error(error);
					if (advice) Toast.fire(error_swal_config), advice=false;
					setTimeout(attemptRequest, (1 * 60 * 1000));  //+ Cada minuto checa
				}
				finally{
					Swal.close();
				}
			};
			attemptRequest();  
		});
	}

	this.pushServerData = function(url, data, { content_type }) {
		Swal.fire(loading_swal_config);
		return new Promise((resolve, reject) => {
			const headers = content_type === "json" ? { "Content-Type": "application/json" } : {};
			fetch(url, {
				body: content_type === "json" ? JSON.stringify(data) : data,
				method: "POST",
				headers: headers
			})
			.then(response => {
				Swal.close();
				if (response.status !== 200) {
					return response.json().then(response => {throw new Error(response.error)});
				}
				return response.json();
			})
			.then(data => {
				Swal.fire({ ...accepted_swal_config, ...{ html: data.message } });
				resolve(data);
			})
			.catch(error => {
				Swal.close();
				Swal.fire({ ...issues_swal_config, ...{ html: error } });
				reject(error);
			});
		});
	};
	
	this.load = function() {
		console.log('👋 DataService cargado correctamente');
	};
}]);
