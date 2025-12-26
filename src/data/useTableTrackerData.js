import { useState, useEffect, useContext } from 'react';
import { apiService } from '../service/ApiService'; // Adjust path as necessary
import { GET_url } from '../connection/connection'; // Adjust path as necessary
import { Context } from '../common/helper/Context';

/**
 * Custom hook to fetch and manage table tracker data.
 * @returns {{data: Array, loading: boolean, fetchTrackerData: Function}}
 */
export function useTableTrackerData() {
    const { trackerData, setTrackerData, isTrackerDataLoading, setIsTrackerDataLoading } = useContext(Context);

    const fetchTrackerData = async () => {
        if (isTrackerDataLoading) return; // Prevent concurrent fetches
        setIsTrackerDataLoading(true);
        try {
            const response = await apiService({ url: GET_url.TableTracker });
            if (response && response.status === 'success' && Array.isArray(response.data)) {
                setTrackerData(response.data);
            } else {
                console.error("Failed to fetch tracker data or data is not in the expected format:", response);
                setTrackerData([]);
            }
        } catch (error) {
            console.error("API error while fetching tracker data:", error);
            setTrackerData([]);
        } finally {
            setIsTrackerDataLoading(false);
        }
    };

    useEffect(() => {
        // Fetch only if data is not present and not already loading
        if (!trackerData && !isTrackerDataLoading) {
            fetchTrackerData();
        }
    }, []); // Only run on initial mount

    return { data: trackerData || [], loading: isTrackerDataLoading, fetchTrackerData };
}
