<?php

namespace Amorphous\Plugin\Entity;

use Amorphous\Plugin\Database\PDOConnection as Connection;
use Amorphous\Plugin\Database\Finder;
use PDO;

/**
 * Class HoursRepository
 *
 * Methods construct SQL statements for PDO and
 * hydrate the Hours class with the results
 *
 * @package Amorphous\Plugin\Entity
 */
class HoursRepository {

	/**
	 * const TABLE - main table name defined in base plugin file
	 */
	const TABLE = HOURS_TABLE;
	const DEPT_TABLE = HOURS_DEPT_TABLE;
	/**
	 * @var Connection
	 */
	protected $connection;

	/**
	 * HoursRepository constructor.
	 *
	 * DI Connection class
	 *
	 * @param Connection $connection
	 */
	public function __construct( Connection $connection ) {
		$this->connection = $connection;
	}

	/**
	 * Fetch all results from the DB and yield them to a
	 * generator
	 *
	 * @return \Generator
	 */
	public function fetchAll() {
		$sql = Finder::select( self::TABLE )
		                 ->getSql();

		$statement = $this->connection->pdo->query( $sql );

		$results = $statement->fetchAll( PDO::FETCH_ASSOC );
		foreach ( $results as $result ) {
			yield Hours::arrayToEntity( $result, new Hours() );
		}
	}

	/**
	 * Fetch result based on AI id, yield to generator
	 *
	 * @param int $id
	 *
	 * @return \Generator
	 */
	public function fetchById( $id ) {
		$prepare = Finder::select( self::TABLE )
		                 ->where( 'id = :id' )
		                 ->getSql();


		$statement = $this->connection->pdo->prepare( $prepare );
		$statement->bindParam( ':id', $id, PDO::PARAM_INT );
		$statement->execute();

		$result = $statement->fetch( PDO::FETCH_ASSOC );
		yield Hours::arrayToEntity( $result, new Hours() );
	}
}