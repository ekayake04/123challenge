<?php
namespace App\Controller;

use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

class LoginController extends AbstractController
{
    /**
     * @Route("/api/login", name="api_login", methods={"POST"})
     */
    public function login(Request $request, UserPasswordHasherInterface $passwordHasher, EntityManagerInterface $em): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        $email = $data['email'] ?? null;
        $plain = $data['password'] ?? null;

        if (!$email || !$plain) {
            return new JsonResponse(['error' => 'email and password required'], Response::HTTP_BAD_REQUEST);
        }

        $user = $em->getRepository(User::class)->findOneBy(['email' => $email]);
        if (!$user) {
            return new JsonResponse(['error' => 'invalid_credentials'], Response::HTTP_UNAUTHORIZED);
        }

        if (!$user->isVerified()) {
            return new JsonResponse(['error' => 'account_not_verified'], Response::HTTP_FORBIDDEN);
        }

        if (!$passwordHasher->isPasswordValid($user, $plain)) {
            return new JsonResponse(['error' => 'invalid_credentials'], Response::HTTP_UNAUTHORIZED);
        }

        return new JsonResponse(['status' => 'ok', 'message' => 'logged_in', 'user' => ['id' => $user->getId(), 'email' => $user->getEmail()]]);
    }
}
