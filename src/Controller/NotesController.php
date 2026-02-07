<?php
namespace App\Controller;

use App\Entity\Note;
use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class NotesController extends AbstractController
{
    /**
     * @Route("/api/notes", name="api_notes_create", methods={"POST"})
     */
    public function create(Request $request, EntityManagerInterface $em): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        $title = $data['title'] ?? null;
        $content = $data['content'] ?? null;
        $category = $data['category'] ?? null;
        $status = $data['status'] ?? 'new';
        $userId = $data['user_id'] ?? null;

        if (!$title || !$content || !$userId) {
            return new JsonResponse(['error' => 'title, content and user_id required'], Response::HTTP_BAD_REQUEST);
        }

        $user = $em->getRepository(User::class)->find($userId);
        if (!$user) {
            return new JsonResponse(['error' => 'invalid_user'], Response::HTTP_BAD_REQUEST);
        }

        $note = new Note();
        $note->setTitle($title)->setContent($content)->setCategory($category)->setStatus($status)->setUser($user);

        $em->persist($note);
        $em->flush();

        return new JsonResponse(['status' => 'ok', 'note_id' => $note->getId()], Response::HTTP_CREATED);
    }

    /**
     * @Route("/api/notes", name="api_notes_list", methods={"GET"})
     */
    public function list(Request $request, EntityManagerInterface $em): JsonResponse
    {
        $q = $request->query->get('q');
        $status = $request->query->get('status');
        $category = $request->query->get('category');

        $notes = $em->getRepository(Note::class)->searchByTextAndFilters($q, $status, $category);

        $out = array_map(function (Note $n) {
            return [
                'id' => $n->getId(),
                'title' => $n->getTitle(),
                'content' => $n->getContent(),
                'category' => $n->getCategory(),
                'status' => $n->getStatus(),
                'user_id' => $n->getUser() ? $n->getUser()->getId() : null,
                'created_at' => $n->getCreatedAt()->format(DATE_ATOM),
            ];
        }, $notes);

        return new JsonResponse($out);
    }
}
