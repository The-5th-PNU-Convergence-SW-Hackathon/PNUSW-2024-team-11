const express = require('express');
const path = require('path');
const router = express.Router();
const { deletePost, incrementViewCount, getPosts, getPostDetails } = require('../js/sql/board');

// 메인 페이지 로드
router.get('/', (req, res) => {
    res.sendFile('index.html', { root: './board' });
});

// 게시글 목록 API
router.get('/posts', async (req, res) => {
    const searchQuery = req.query.search || '';
    try {
        const posts = await getPosts(searchQuery);
        res.json(posts);
    } catch (error) {
        res.status(500).json({ message: '게시글 목록을 불러오는데 실패했습니다.', error: error.message });
    }
});

// 게시글 상세 페이지 로드
router.get('/post/:postId', (req, res) => {
    if (req.session && req.session.USER) {
        // 사용자가 로그인한 경우 상세 페이지를 제공
        res.sendFile('detail.html', { root: './board' });
    } else {
        // 사용자가 로그인하지 않은 경우 로그인 페이지로 리다이렉트
        res.redirect('/login');
    }
});

// 게시글 수정 페이지 로드
router.get('/post/:postId/edit', (req, res) => {
    if (req.session && req.session.USER) {
        // 사용자가 로그인한 경우 수정 페이지를 제공
        res.sendFile('edit.html', { root: './board' });
    } else {
        // 사용자가 로그인하지 않은 경우 로그인 페이지로 리다이렉트
        res.redirect('/login');
    }
});

// 게시글 상세보기 및 수정 API
router.get('/api/post/:postId', async (req, res) => {
    const postId = req.params.postId;
    console.log('Fetching post details for ID:', postId); // 디버깅: postId 로그
    try {
        const post = await getPostDetails(postId);

        if (post) {
            if (req.session && req.session.USER) {
                const userId = req.session.USER[0];  // 현재 로그인한 사용자 ID
                const isAuthor = post.sellerId === userId;
                res.status(200).json({ ...post, isAuthor });
            } else {
                res.status(401).json({ message: '로그인이 필요합니다.' });
            }
        } else {
            res.status(404).json({ message: '게시글을 찾을 수 없습니다.' });
        }
    } catch (error) {
        res.status(500).json({ message: '게시글 조회에 실패했습니다.', error: error.message });
    }
});


// 게시글 조회수 증가 API
router.post('/api/post/:postId/view', async (req, res) => {
    const postId = req.params.postId;

    try {
        await incrementViewCount(postId);
        res.status(200).send({ message: '조회수가 업데이트되었습니다.' });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});

// 게시글 삭제 API
router.delete('/api/post/:id', async (req, res) => {
    const postId = req.params.id;
    try {
        const result = await deletePost(postId);
        res.status(200).json({ message: '게시글이 삭제되었습니다.' });
    } catch (error) {
        console.error('게시글 삭제 오류:', error);
        res.status(500).json({ message: '게시글 삭제에 실패했습니다.' });
    }
});

module.exports = router;
