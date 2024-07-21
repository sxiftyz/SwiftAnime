"use client";
import React, { useEffect, useState } from 'react';
import styles from "./component.module.css";
import {
    getFirestore, doc, setDoc,
    DocumentData, QueryDocumentSnapshot, collection, getDocs,
    getDoc, where, query,
} from 'firebase/firestore';
import { initFirebase } from '@/app/firebaseApp';
import { getAuth } from 'firebase/auth';
import { useAuthState } from 'react-firebase-hooks/auth';
import { ApiDefaultResult, ApiMediaResults } from '@/app/ts/interfaces/apiAnilistDataInterface';
import CommentContainer from './components/CommentContainer';
import SvgLoading from "@/public/assets/ripple-1s-200px.svg";
import SvgFilter from "@/public/assets/filter-right.svg";
import ShowUpLoginPanelAnimated from '../UserLoginModal/animatedVariant';
import WriteCommentFormContainer from './components/WriteCommentForm';
import { useAppDispatch, useAppSelector } from '@/app/lib/redux/hooks';
import { UserComment } from '@/app/ts/interfaces/firestoreDataInterface';
import { toggleShowLoginModalValue } from '@/app/lib/redux/features/loginModal';

type CommentsSectionTypes = {
    mediaInfo: ApiMediaResults | ApiDefaultResult,
    isOnWatchPage?: boolean,
    episodeId?: string,
    episodeNumber?: number
}

export default function CommentsSection({ mediaInfo, isOnWatchPage, episodeId, episodeNumber }: CommentsSectionTypes) {
    const [commentsList, setCommentsList] = useState<UserComment[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [commentsSliceRange, setCommentsSliceRange] = useState<number>(3);

    const anilistUser = useAppSelector((state) => (state.UserInfo).value);
    const dispatch = useAppDispatch();
    const auth = getAuth();
    const [user] = useAuthState(auth);
    const db = getFirestore(initFirebase());

    useEffect(() => { 
        getCommentsForCurrMedia(); 
    }, [mediaInfo, user, anilistUser, episodeId]);

    function handleCommentsSliceRange() { 
        setCommentsSliceRange(commentsSliceRange + 10); 
    }

    async function handleCommentsSortBy(sortBy: "date" | "likes" | "dislikes", commentsUnsorted?: UserComment[]) {
        setIsLoading(true);
        if (!commentsUnsorted) commentsUnsorted = await getCommentsForCurrMedia();

        let sortedComments: UserComment[];

        switch (sortBy) {
            case "date":
                sortedComments = commentsUnsorted!.sort((x, y) => y.createdAt - x.createdAt);
                break;
            case "likes":
                sortedComments = commentsUnsorted!.sort((x, y) => y.likes - x.likes);
                break;
            case "dislikes":
                sortedComments = commentsUnsorted!.sort((x, y) => y.dislikes - x.dislikes);
                break;
            default:
                sortedComments = commentsUnsorted!.sort((x, y) => y.createdAt - x.createdAt);
                break;
        }

        setCommentsList(sortedComments);
        setIsLoading(false);
    }

    async function getCommentsForCurrMedia() {
    setIsLoading(true);

    let mediaCommentsSnapshot = await getDocs(collection(db, 'comments', `${mediaInfo.id}`, isOnWatchPage ? `${episodeId}` : "all"));

    if (mediaCommentsSnapshot.empty) {
        await setDoc(doc(db, 'comments', `${mediaInfo.id}`), {});
        mediaCommentsSnapshot = await getDocs(collection(db, 'comments', `${mediaInfo.id}`, isOnWatchPage ? `${episodeId}` : "all"));
    }

    if (isOnWatchPage) {
        const commentsForCurrEpisode: UserComment[] = [];
        const queryCommentsToThisEpisode = query(collection(db, 'comments', `${mediaInfo.id}`, "all"), where("episodeNumber", "==", episodeNumber));
        const querySnapshot = await getDocs(queryCommentsToThisEpisode);
        querySnapshot.docs.forEach(doc => commentsForCurrEpisode.push({ ...doc.data(), createdAt: doc.data().createdAt.toDate() }));
        await handleCommentsSortBy("date", commentsForCurrEpisode);
        setIsLoading(false);
        return commentsForCurrEpisode;
    }

    const mediaCommentsMapped = await Promise.all(mediaCommentsSnapshot.docs.map(async (doc: QueryDocumentSnapshot<DocumentData>) => {
        const commentData = doc.data();
        const userDocRef = doc(db, 'users', commentData.userId); // Create a reference to the user document
        const userDoc = await getDoc(userDocRef); // Fetch the user document
        const userData = userDoc.data(); // Access the document data
        return {
            ...commentData,
            userData,
            createdAt: commentData.createdAt.toDate() // Assuming createdAt is a Timestamp
        };
    }));

    await handleCommentsSortBy("date", mediaCommentsMapped as UserComment[]);
    setIsLoading(false);
    return mediaCommentsMapped as UserComment[];
}


    return (
        <div id={styles.container}>
            <WriteCommentFormContainer
                isLoadingHook={isLoading}
                loadComments={getCommentsForCurrMedia}
                mediaInfo={mediaInfo}
                setIsLoadingHook={setIsLoading}
                setIsUserModalOpenHook={() => dispatch(toggleShowLoginModalValue())}
                episodeId={episodeId}
                episodeNumber={episodeNumber}
                isOnWatchPage={isOnWatchPage}
            />

            {/* ALL COMMENTS FROM DB FOR THIS MEDIA */}
            <div id={styles.all_comments_container}>
                {commentsList.length > 0 && (
                    <React.Fragment>
                        <div id={styles.comments_heading}>
                            {commentsList.length > 1 && (
                                <div id={styles.custom_select}>
                                    <SvgFilter width={16} height={16} alt="Filter" />
                                    <select
                                        onChange={(e) => handleCommentsSortBy(e.target.value as "date" | "likes" | "dislikes")}
                                        title="Choose How To Sort The Comments"
                                    >
                                        <option selected value="date">Most Recent</option>
                                        <option value="likes">Most Likes</option>
                                        <option value="dislikes">Most Dislikes</option>
                                    </select>
                                </div>
                            )}
                            <p>{commentsList.length} comment{commentsList.length > 1 ? "s" : ""}</p>
                        </div>
                        <ul>
                            {!isLoading && (
                                commentsList.slice(0, commentsSliceRange).map((comment) => (
                                    <CommentContainer
                                        key={comment.createdAt.toISOString()}
                                        comment={comment}
                                        mediaId={mediaInfo.id}
                                        isLoadingHook={isLoading}
                                        loadComments={getCommentsForCurrMedia}
                                        mediaInfo={mediaInfo}
                                        setIsLoadingHook={setIsLoading}
                                        setIsUserModalOpenHook={() => dispatch(toggleShowLoginModalValue())}
                                        episodeId={episodeId}
                                        episodeNumber={episodeNumber}
                                        isOnWatchPage={isOnWatchPage}
                                    />
                                ))
                            )}
                        </ul>
                        {commentsList.length > commentsSliceRange && (
                            <button onClick={() => handleCommentsSliceRange()}>
                                SEE MORE COMMENTS
                            </button>
                        )}
                    </React.Fragment>
                )}
                {isLoading && (
                    <div>
                        <SvgLoading width={120} height={120} alt="Loading" />
                    </div>
                )}
                {(commentsList.length === 0 && !isLoading) && (
                    <div id={styles.no_comments_container}>
                        <p>No Comments Yet</p>
                    </div>
                )}
            </div>
        </div>
    );
}
