/* @flow */
/* global it describe beforeEach afterAll expect jest */
import { Tracker } from '../../src/tracker-component';
import { getPropertyId } from '../../src/lib/get-property-id';
import { track } from '../../src/lib/track';
import constants from '../../src/lib/constants';

jest.mock('../../src/lib/track');
jest.mock('../../src/lib/get-property-id', () => {
    return {
        // eslint-disable-next-line require-await
        getPropertyId: async () => 'mockpropertyidofsomekind'
    };
});

describe('setUser', () => {
    const { defaultTrackerConfig } = constants;

    let config;
    let mockItem;

    beforeEach(() => {
        config = {
            propertyId: 'foobar',
            user: {
                id: 'arglebargle123',
                name: 'Bob Ross',
                email: 'bossrob21@pbs.org'
            }
        };

        mockItem = {
            id: 'XL novelty hat',
            imgUrl: 'https://www.paypalobjects.com/digitalassets/c/gifts/media/catalog/product/b/e/bestbuy.jpg',
            price: '100.00',
            title: 'Best Buy',
            url: 'http://localhost.paypal.com:8080/us/gifts/brands/best-buy',
            quantity: 1
        };
    });

    afterEach(() => {
        track.mockReset();
        window.localStorage.removeItem('paypal-cr-cart');
        window.localStorage.removeItem('paypal-cr-cart-expirty');
    });

    afterAll(() => {
        track.mockRestore();
        getPropertyId.mockRestore();
    });

    it('user should be set when the tracker is initialized', () => {
        const tracker = Tracker(config);

        tracker.addToCart({ items: [ mockItem ] });
        tracker.removeFromCart({ items: [ mockItem ] });

        const args = track.mock.calls;

        expect(args[0][0].user).toEqual(config.user);
        expect(args[1][0].user).toEqual(config.user);
    });

    it('no user should be set if no configuration is passed to initialization', (done) => {
        const tracker = Tracker();

        // wait for mock propertyId to resolve
        setTimeout(() => {
            tracker.addToCart({ items: [ mockItem ] });
            tracker.removeFromCart({ items: [ mockItem ] });

            const args = track.mock.calls;
            expect(args[0][0].user).toEqual(defaultTrackerConfig.user);
            expect(args[1][0].user).toEqual(defaultTrackerConfig.user);
            done();
        }, 100);
    });

    it('no user should be set if no user is passed to initialization', () => {
        const tracker = Tracker({ propertyId: 'somevalue' });

        tracker.addToCart({ items: [ mockItem ] });
        tracker.removeFromCart({ items: [ mockItem ] });

        const args = track.mock.calls;
        expect(args[0][0].user).toEqual(defaultTrackerConfig.user);
        expect(args[1][0].user).toEqual(defaultTrackerConfig.user);
    });

    it('user should be set when set user is called', () => {
        const tracker = Tracker({ propertyId: 'somevalue' });

        tracker.addToCart({ items: [ mockItem ] });
        tracker.removeFromCart({ items: [ mockItem ] });

        tracker.setUser(config.user);
        tracker.addToCart({ items: [ mockItem ] });
        tracker.removeFromCart({ items: [ mockItem ] });

        const args = track.mock.calls;
        expect(args[0][0].user).toEqual(defaultTrackerConfig.user);
        expect(args[1][0].user).toEqual(defaultTrackerConfig.user);
        expect(args[2][0].user).toEqual(config.user);
        expect(args[3][0].user).toEqual(config.user);
        expect(args[4][0].user).toEqual(config.user);
    });

    it('already-existing user should be updated when set user is called', () => {
        const alternateUser = {
            id: 'wut',
            name: 'Steve Jobs',
            email: 'steve@apple.com'
        };

        const tracker = Tracker(config);

        tracker.addToCart({ items: [ mockItem ] });
        tracker.removeFromCart({ items: [ mockItem ] });

        tracker.setUser(alternateUser);
        tracker.addToCart({ items: [ mockItem ] });
        tracker.removeFromCart({ items: [ mockItem ] });

        const args = track.mock.calls;
        expect(args[0][0].user).toEqual(config.user);
        expect(args[1][0].user).toEqual(config.user);
        expect(args[2][0].user).toEqual(alternateUser);
        expect(args[3][0].user).toEqual(alternateUser);
        expect(args[4][0].user).toEqual(alternateUser);
    });


    it('setUser accepts different types of input', () => {
        const alternateUser = {
            id: 'wut',
            name: 'Steve Jobs',
            email: 'steve@apple.com'
        };
    
        const tracker = Tracker({ propertyId: 'somevalue' });

        tracker.setUser(alternateUser);
        tracker.addToCart({ items: [ mockItem ] });
        tracker.removeFromCart({ items: [ mockItem ] });

        tracker.setUser({ user: config.user });
        tracker.addToCart({ items: [ mockItem ] });
        tracker.removeFromCart({ items: [ mockItem ] });
        const args = track.mock.calls;

        expect(args[0][0].user).toEqual(alternateUser);
        expect(args[1][0].user).toEqual(alternateUser);
        expect(args[2][0].user).toEqual(alternateUser);
        expect(args[3][0].user).toEqual(config.user);
        expect(args[4][0].user).toEqual(config.user);
        expect(args[5][0].user).toEqual(config.user);
    });

    it('user can be unset by passing null', () => {
        const alternateUser = {
            id: 'wut',
            name: 'Steve Jobs',
            email: 'steve@apple.com'
        };
        const tracker = Tracker(config);

        tracker.setUser({
            id: null,
            email: null,
            name: null
        });
        tracker.addToCart({ items: [ mockItem ] });
        tracker.removeFromCart({ items: [ mockItem ] });

        tracker.setUser(alternateUser);
        tracker.addToCart({ items: [ mockItem ] });
        tracker.removeFromCart({ items: [ mockItem ] });
        const args = track.mock.calls;
    
        expect(args[0][0].user).toEqual(defaultTrackerConfig.user);
        expect(args[1][0].user).toEqual(defaultTrackerConfig.user);
        expect(args[2][0].user).toEqual(defaultTrackerConfig.user);

        expect(args[3][0].user).toEqual(alternateUser);
        expect(args[4][0].user).toEqual(alternateUser);
        expect(args[5][0].user).toEqual(alternateUser);
    });
});
