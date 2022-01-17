class _NavigationService {
    navigation = null;
    route = null;

    init(navigation, route = null){
        this.navigation = navigation;
        this.route = route;
    }
}

const NavigationService = new _NavigationService();

export default NavigationService;
