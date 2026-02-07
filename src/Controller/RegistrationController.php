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

class RegistrationController extends AbstractController
{
    /**
     * @Route("/api/register", name="api_register", methods={"POST"})
     */
    public function register(Request $request, UserPasswordHasherInterface $passwordHasher, EntityManagerInterface $em): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        $email = $data['email'] ?? null;
        $plain = $data['password'] ?? null;

        if (!$email || !$plain) {
            return new JsonResponse(['error' => 'email and password required'], Response::HTTP_BAD_REQUEST);
        }

        $existing = $em->getRepository(User::class)->findOneBy(['email' => $email]);
        if ($existing) {
            return new JsonResponse(['error' => 'email already used'], Response::HTTP_CONFLICT);
        }

        $user = new User();
        $user->setEmail($email);
        $hashed = $passwordHasher->hashPassword($user, $plain);
        $user->setPassword($hashed);
        $token = bin2hex(random_bytes(16));
        $user->setVerificationToken($token);
        $user->setRoles(['ROLE_USER']);

        $em->persist($user);
        $em->flush();

        $dir = $this->getParameter('kernel.project_dir').'/var/emails';
        if (!is_dir($dir)) { @mkdir($dir, 0777, true); }
        $filename = $dir.'/registration_'.time().'_'.uniqid().'.eml';
        $content = "To: $email\nSubject: Confirm your account\n\nClick link: http://localhost:81/confirm?token=".$token;
        @file_put_contents($filename, $content);

        return new JsonResponse(['status' => 'ok', 'message' => 'user_registered'], Response::HTTP_CREATED);
    }
}
