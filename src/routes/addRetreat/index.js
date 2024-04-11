import React from 'react';
import Layout from '../../components/Layout/Layout';
import ListRetreat from './ListRetreat';

// Redux Action
import { getListingFields } from '../../actions/getListingFields';
import { getCategoriesData } from '../../actions/getCategories';
import { getMealData } from '../../actions/getMeals';
import { getAreaData } from '../../actions/getAreas';
import { getLanguageData } from '../../actions/getLanguages';

const title = 'List a Retreat';

export default {

    path: '/list-retreat/:listId?',

    async action({ params, store, query }) {

        // From Redux Store
        const isAuthenticated = store.getState().runtime.isAuthenticated;
        const isAdminAuthenticated = store.getState().runtime.isAdminAuthenticated;
        const listingFields = store.getState().listingFields.data;
        const baseCurrency = store.getState().currency.base;

        // From URI
        const listId = params.listId;
        const formBaseURI = "/list-retreat";

        let mode;

        if ("mode" in query) {
            if (query.mode === "new") {
                mode = query.mode;
            }
        }

        if (!isAuthenticated && !isAdminAuthenticated) {
            return { redirect: '/login' };
        }

        store.dispatch(getCategoriesData());
        store.dispatch(getMealData());
        store.dispatch(getLanguageData());
        store.dispatch(getAreaData());

        // Fetch all settings fields 
        if (listingFields === undefined) {
            store.dispatch(getListingFields());
        }

        return {
            title,
            component: <Layout>
                <ListRetreat
                    listId={Number(listId)}
                    title={title}
                    formBaseURI={formBaseURI}
                    mode={mode}
                    baseCurrency={baseCurrency}
                />
            </Layout>
        };
    },

};
